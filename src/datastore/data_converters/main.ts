import { TikTokComment, TikTokVideo } from '../../tiktok/types/main';
import { AIResponse, SkippedComment } from '../types/main';

export const aiResponseConverter = {
    toFirestore(aiRes: AIResponse): FirebaseFirestore.DocumentData {
        return { ...aiRes }
    },
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): AIResponse {
        const data = snapshot.data();
        return {
            approved_at: data.approved_at || null,
            comment_id: data.comment_id,
            create_time: data.create_time || Date.now(),
            edited_at: data.edited_at || null,
            responded_at: data.responded_at || null,
            generated_response: data.generated_response,
        }
    }
}

export const commentConverter = {
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
            reply_list: data.reply_list,
        }
    }
}

export const skippedCommentConverter = {
    toFirestore(skipped: SkippedComment): FirebaseFirestore.DocumentData {
        return { ...skipped }
    },
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): SkippedComment {
        const data = snapshot.data();
        return {
            comment_id: data.comment_id,
            reason: data.reason,
            skipped_at: data.skipped_at,
            skipped_by_id: data.skipped_by_id,
            skipped_by_name: data.skipped_by_name,
        }
    }
}

export const videoConverter = {
    toFirestore(video: TikTokVideo): FirebaseFirestore.DocumentData {
        return { ...video }
    },
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): TikTokVideo {
        const data = snapshot.data();
        return {
            item_id: data.item_id,
            create_time: data.create_time,
            thumbnail_url: data.thumbnail_url,
            share_url: data.share_url,
            embed_irl: data.embed_url,
            caption: data.caption,
            video_views: data.video_views,
            video_duration: data.video_duration,
            likes: data.likes,
            comments: data.comments,
            shares: data.shares,
            reach: data.reach,
            full_video_watched_rate: data.full_video_watched_rate,
            total_time_watched: data.total_time_watched,
            average_time_watched: data.average_time_watched,
            impression_sources: data.impression_sources,
            audience_countries: data.audience_countries,
        }
    }
}
