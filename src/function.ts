import * as dotenv from 'dotenv';
import fs from 'fs';

import * as ff from '@google-cloud/functions-framework';
import protobuf from 'protobufjs';
import {Firestore} from '@google-cloud/firestore';
import { createClient, RedisClientType } from 'redis';

// DATASTORE
import { getFirestore } from './datastore/main';
import { getRefreshToken } from './datastore/getRefreshToken';
import { getAllVideos } from './datastore/getVideos';
import { createRefreshToken } from './datastore/createRefreshToken';
import { RefreshToken } from './datastore/types/main';
import { upsertComment, upsertVideo } from './datastore/upsert';

// TIK TOK
import { getNewAccessToken } from './tiktok/getNewAccessToken';
import { AccessToken, TikTokComment, TikTokEvent, TikTokVideo } from './tiktok/types/main';
import { getVideoById } from './tiktok/getVideoById';
import { getCommentById } from './tiktok/getCommentById';

// REDIS
import { updateAccessToken } from './redis/updateAccessToken';
import { getAccessToken } from './redis/getAccessToken';
import { CloudEventV1 } from 'cloudevents';
import { StringDecoder } from 'string_decoder';
import { getAwaitingReplyByVideoID, TikTokCommentWithTree } from './datastore/getAwaitingReply';

if (process.env.NODE_ENV === 'dev') {
    dotenv.config();
}

ff.http('refreshTokens', async (req: ff.Request, res:ff.Response) => {
    // get firestore
    const firestore: Firestore = getFirestore();

    const redisClient: RedisClientType = createClient({
        socket: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT),
        }
    });
    redisClient.on('error', (e: Error) => console.error('ERR:REDIS:', e));
    redisClient.connect();

    // get current refresh token from datastore
    const rt: RefreshToken = await getRefreshToken(firestore);

    // get new access token from TikTok
    const at: AccessToken = await getNewAccessToken(rt.token);

    // update access token in redis
    await updateAccessToken(redisClient, at.access_token);
    
    // create a refresh token with the new expiration in the datastore
    await createRefreshToken(firestore, at.refresh_token, at.refresh_token_expires_in);

    res.send('OK');
});


interface DocumentEventData {
    value: TikTokComment,
    oldValue: TikTokComment,
}

ff.cloudEvent<CloudEventV1<protobuf.Message<DocumentEventData>>>('getTikTokComment', async (cloudEvent) => {
    console.log(`Function triggered by event on: ${cloudEvent.source}`);
    console.log(`Event type: ${cloudEvent.type}`);

    const root = await protobuf.load('data.proto');
    const DocumentEventData = root.lookupType(
        'google.events.cloud.firestore.v1.DocumentEventData'
    );

    // @ts-expect-error
    const firestoreReceived = DocumentEventData.decode(cloudEvent.data);

    const data = DocumentEventData.toObject(firestoreReceived).value.fields;
    const content = data.content?.mapValue?.fields;

    if (typeof content?.video_id.stringValue === 'undefined' || typeof content?.comment_id.stringValue === 'undefined') {
        console.error("Request should include a video and comment identifier"); 
        return;
    }
    if (content?.comment_type.stringValue === 'delete') {
        console.log(`Ignoring deleted comment ${data?.comment_id.stringValue}`);
        return;
    }

    const video_id: string = content.video_id.stringValue;
    const comment_id: string = content.comment_id.stringValue;

    // get access token from redis
    const redisClient: RedisClientType = createClient({
        socket: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT),
        }
    });
    redisClient.on('error', (e: Error) => console.error('ERR:REDIS:', e));
    redisClient.connect();

    const firestore: Firestore = getFirestore();

    const tiktokAccessToken = await getAccessToken(redisClient);

    console.log('Getting data from TikTok...');

    const video = await getVideoById(tiktokAccessToken, video_id);
    const comment = await getCommentById(tiktokAccessToken, video_id, comment_id);

    console.log('Data pulled...');

    await upsertVideo(firestore, video);
    await upsertComment(firestore, comment);

    console.log('Video and comment upsert complete!');
});

ff.http('getHomeData', async (req: ff.Request, res: ff.Response) => {
    const firestore: Firestore = getFirestore();

    // get all videos
    const videos: Array<TikTokVideo> = await getAllVideos(firestore);

    const homeData: {[key: string]: { video: TikTokVideo, awaitingRep: Array<TikTokCommentWithTree> }} = videos.reduce(
        (acc: {[key: string]: { video: TikTokVideo, awaitingRep: Array<TikTokCommentWithTree> }}, v: TikTokVideo) => {
        acc[v.item_id] = { video: v, awaitingRep: [] };

        return acc;
    }, {});

    for(const v of videos) {
        const awaitingRep = await getAwaitingReplyByVideoID(firestore, v.item_id);
        homeData[v.item_id].awaitingRep = awaitingRep;
    }
 
    res.json(homeData);
});

ff.http('getResponses', async (req: ff.Request, res: ff.Response) => {

});

ff.http('getHistory', async (req: ff.Request, res: ff.Response) => {

});

ff.http('skipComment', async (req: ff.Request, res: ff.Response) => {
    // provide an interface for users to be able to skip comments that 
});
