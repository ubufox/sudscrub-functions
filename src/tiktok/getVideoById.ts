import { TikTokVideo } from './types/main';
import { VIDEO_FIELDS } from './consts';

import { VIDEO_LIST_URL } from './endpoints';

export const getVideoById = async (access_token: string, video_id: string): Promise<TikTokVideo> => {
    const url = `${VIDEO_LIST_URL}?business_id=${process.env.BUSINESS_ID}&fields=${JSON.stringify(VIDEO_FIELDS)}&filters={"video_ids":["${video_id}"]}`;

    const res = await fetch(url
        ,
        {
            method: 'get',
            headers: {
                'Access-Token': access_token,
            },
        }
    );

    if (res.status !== 200) {
        console.log(res);
        throw new Error('Error retreiving video from TikTok');
    }

    const video: any = await res.json();

    if (video?.data?.videos.length === 0) {
        throw new Error(`Video ID -> ${video_id} returned no videos`);
    }

    return video?.data?.videos[0];
};
