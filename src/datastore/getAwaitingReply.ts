import {Firestore, QueryDocumentSnapshot, QuerySnapshot} from '@google-cloud/firestore';
import { TikTokComment } from '../tiktok/types/main';
import {
    COMMENT_COLLECTION,
    SKIPPED_COMMENT_COLLECTION,
    AI_RESPONSE_COLLECTION,
} from './consts';


//       - a comment is "awaiting reply" if it is not
//           - already has a response from sudscrub
//           - has an ai-response submitted by a sudscrub manager
//           - skipped

const commentConverter = {
    toFirestore(comment: TikTokComment): FirebaseFirestore.DocumentData {
        return { ...comment };
    },
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): TikTokComment {
        const data = snapshot.data();
        return {
            comment_id: data.comment_id,
            video_id: data.video_id,
            user_id: data.user_id,
            create_time: data.create_time,
            text: data.text,
            likes: data.likes,
            replies: data.replies,
            owner: data.owner,
            liked: data.liked,
            pinned: data.pinned,
            status: data.status,
            username: data.username,
            profile_image: data.profile_image,
            parent_comment_id: data.parent_comment_id,
            reply_list: [],
        }
    }
}

export const getAwaitingReplyByVideoID = async (f: Firestore, video_id: string): Promise<any> => {
    const commentColRef = f.collection(COMMENT_COLLECTION).withConverter(commentConverter);

    const comments = await commentColRef
        .where('video_id', '==', video_id)
        .get();

    const convertedComments = comments.docs.map(doc => doc.data());

    // this will build an array of comments that don't have any children responses from sudscrub
    const awaitingResponse: Array<TikTokComment> = convertedComments.reduce((acc: Array<TikTokComment>, d: TikTokComment) => {
        // if it has been responded to then we should not add it to the awaiting responses array
        if (checkIfResponded(d, convertedComments)) {
            return acc;
        }

        acc.push(d);
        return acc;
    }, []);

    const skippedColRef = f.collection(COMMENT_COLLECTION);

    return {};
}

const checkIfResponded = (
    comment: TikTokComment,
    other_comments: Array<TikTokComment>
): boolean => {
    // no point in checking Sudscrub owned comments
    if (comment.owner === true) {
        return true;
    }

    return other_comments.reduce((acc: boolean, c: TikTokComment) => {
        // if we've already determined that it has been responded to then just return true
        if (acc === true) return acc;

        // don't check a comment against itself
        if (c.comment_id === comment.comment_id) {
            return acc;
        }

        // if check our comment has a child comment from sudscrub
        if (c.parent_comment_id === comment.comment_id && c.owner === true) {
            return true;
        }

        return acc;
    }, false);
};
