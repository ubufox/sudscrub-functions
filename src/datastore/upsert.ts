import { Firestore } from '@google-cloud/firestore';

import { TikTokVideo, TikTokComment } from '../tiktok/types/main';

const VIDEO_COLLECTION_REF = 'video';
const COMMENT_COLLECTION_REF = 'comment';

export const upsertVideo = async (f:Firestore, video: TikTokVideo) => {
    const collectionReference = f.collection(VIDEO_COLLECTION_REF);

    // using the item_id for the video will allow us to more easily access
    // and update matching videos without having to pull first
    return await collectionReference
        .doc(video.item_id)
        .set(video, { merge: true });
}

export const upsertComment = async (f:Firestore, comment: TikTokComment) => {
    const collectionReference = f.collection(COMMENT_COLLECTION_REF);

    // using the item_id for the video will allow us to more easily access
    // and update matching videos without having to pull first
    return await collectionReference
        .doc(comment.comment_id)
        .set(comment, { merge: true });
}
