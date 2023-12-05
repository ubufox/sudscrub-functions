import { TikTokComment } from './types/main';

import { COMMENT_LIST_URL } from './endpoints';

export const getCommentById = async (access_token: string, video_id: string, comment_id: string): Promise<TikTokComment> => {
    const url = `${COMMENT_LIST_URL}?business_id=${process.env.BUSINESS_ID}&video_id=${video_id}&comment_ids=["${comment_id}"]`;

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

    const comment: any = await res.json();

    return comment?.data?.comments[0];
};
