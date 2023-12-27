import {Firestore, QueryDocumentSnapshot, QuerySnapshot} from '@google-cloud/firestore';
import { TikTokComment } from '../tiktok/types/main';
import {
    COMMENT_COLLECTION,
    SKIPPED_COMMENT_COLLECTION,
    AI_RESPONSE_COLLECTION,
} from './consts';
import {
    aiResponseConverter,
    commentConverter,
    skippedCommentConverter
} from './data_converters/main';
import { AIResponse, SkippedComment } from './types/main';

interface CommentTree extends Array<TikTokComment>{};

export interface TikTokCommentWithTree {
    comment: TikTokComment;
    commentTree: CommentTree;
};

export const getAwaitingReplyByVideoID = async (f: Firestore, video_id: string): Promise<Array<TikTokCommentWithTree>> => {
    const commentColRef = f.collection(COMMENT_COLLECTION).withConverter(commentConverter);

    const comments = await commentColRef
        .where('video_id', '==', video_id)
        .get();

    const convertedComments = comments.docs.map(doc => doc.data());
    // making a copy for being used because it feels wrong to use a reference to an array within it's
    // own reduce function
    const checkComments = [...convertedComments];

    // this will build an array of comments that don't have any children responses from sudscrub
    const awaitingResponse: Array<TikTokComment> = convertedComments.reduce((acc: Array<TikTokComment>, d: TikTokComment) => {
        // if it has been responded to then we should not add it to the awaiting responses array
        if (checkIfResponded(d, checkComments)) {
            return acc;
        }

        acc.push(d);
        return acc;
    }, []);

    // used for the "WHERE IN" query
    const awaitingResponseIds = awaitingResponse.map(c => c.comment_id);

    console.log('How many comments are awaiting responses?');
    console.log(awaitingResponseIds.length);

    if (awaitingResponseIds.length === 0) {
        return [];
    }
    
    // where in has a max list of 30
    const aiResColRef = f.collection(AI_RESPONSE_COLLECTION).withConverter(aiResponseConverter);
    const aiResponses = await aiResColRef
        .where('comment_id', 'in', awaitingResponseIds.slice(0, 29))
        .get();
    const approvedAIRes = aiResponses.docs
        .map(doc => doc.data())
        .filter((a) => a.approved_at !== null);

    const skippedColRef = f.collection(SKIPPED_COMMENT_COLLECTION)
        .withConverter(skippedCommentConverter);

    const skipped = await skippedColRef.get();
    const convertedSkipped = skipped.docs.map(doc => doc.data().comment_id);

    const awaitingReply: Array<TikTokComment> = awaitingResponse.reduce((acc: Array<TikTokComment>, d: TikTokComment) => {
        if (checkIfSubmitted(d.comment_id, approvedAIRes)) {
            return acc;
        }

        if (checkIfSkipped(d.comment_id, convertedSkipped)) {
            return acc;
        }

        acc.push(d);
        return acc;
    }, []);

    console.log('awaiting reply');

    const repliesWithCommentTree: Array<TikTokCommentWithTree> = awaitingReply.map((c: TikTokComment) => {
        console.log('Comment ->');
        console.log(c);

        const parentTree: Array<TikTokComment> = [];
        let hasAllParents = false;
        let activeChild = c;

        while (hasAllParents === false) {
            console.log(`Parent comment id -> ${activeChild.parent_comment_id}`);
            if (typeof(activeChild.parent_comment_id?.length) !== 'undefined') {
                const parent = checkComments.find((f) => f.comment_id === activeChild.parent_comment_id);

                if (typeof(parent) !== 'undefined') {
                    parentTree.push(parent);
                    activeChild = parent;
                } else {
                    console.log('Could not find a parent with matching comment id');
                    hasAllParents = true;
                }
            } else {
                console.log('Comment has no parent');
                hasAllParents = true;
            }
        }

        return {
            comment: c,
            commentTree: parentTree,
        };
    });

    return repliesWithCommentTree;
}

// Check if there are any comments with the parent_comment_id matching the comment
// that are from Sudscrub
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

const checkIfSkipped = (
    comment_id: string,
    skipped: Array<string>,
): boolean => typeof(skipped.find((v) => v === comment_id)) !== 'undefined';

const checkIfSubmitted = (
    comment_id: string,
    submitted: Array<AIResponse>,
): boolean => typeof(submitted.find((v) => v.comment_id === comment_id)) !== 'undefined';
