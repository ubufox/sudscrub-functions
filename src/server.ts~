import * as dotenv from 'dotenv';

import * as ff from '@google-cloud/functions-framework';
import {Firestore} from '@google-cloud/firestore';
import { createClient, RedisClientType } from 'redis';

import { getFirestore } from './datastore/main';
import { getRefreshToken } from './datastore/getRefreshToken';
import { createRefreshToken } from './datastore/createRefreshToken';
import { getNewAccessToken } from './tiktok/getNewAccessToken';
import { RefreshToken } from './datastore/types/main';
import { AccessToken } from './tiktok/types/main';
import { updateAccessToken } from './redis/updateAccessToken';

// TODO: EventArc Functions
interface PubSubData {
    subscription: string;
    message: {
        messageId: string;
	publishTime: string;
	data: string;
        attributes?: {[key: string]: string};
    };
}

dotenv.config();

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

    // get current refresh token
    const rt: RefreshToken = await getRefreshToken(firestore);

    const at: AccessToken = await getNewAccessToken(rt.token);

    await updateAccessToken(redisClient, at.access_token);

    await createRefreshToken(firestore, at.refresh_token, at.refresh_token_expires_in);

    res.send('OK');
});

// TODO: EventArc Functions
ff.cloudEvent<PubSubData>('CloudEventFunction', ce => {
    console.log(ce.data?.message.messageId);
});

