export interface AccessToken {
  access_token: string; // Access Token
  expires_in: number; // How long until the access token expires, in seconds
  refresh_token: string; // Refresh token to renew access token
  refresh_token_expires_in: number; // How long until refresh token expires, in seconds
}

interface ImpressionSource {
    impression_source: string;
    percentage: number;
}

interface ImpressionSources extends Array<ImpressionSource>{}

interface AudienceCountry {
    country: string;
    percentage: number;
}

interface AudienceCountries extends Array<AudienceCountry>{}

export interface TikTokVideo {
    item_id: string;
    create_time: string;
    thumbnail_url: string;
    share_url: string;
    embed_irl: string;
    caption: string;
    video_views: number;
    video_duration: number;
    likes: number;
    comments: number;
    shares: number;
    reach: number;
    full_video_watched_rate: number;
    total_time_watched: number;
    average_time_watched: number;
    impression_sources: ImpressionSources;
    audience_countries: AudienceCountries;
}

interface Reply {
    video_id: number;
    commend_id: number;
    create_time: string;
    text: string;
    status: string;
    liked: boolean;
    likes: number;
    owner: boolean;
    user_id: string;
    username: string;
    profile_image: string;
    parent_comment_id: string;
}

interface Replies extends Array<Reply>{}

export interface TikTokComment {
    comment_id: string;
    video_id: string;
    user_id: string;
    create_time: number;
    text: string;
    likes: number;
    replies: number;
    owner: boolean;
    liked: boolean;
    pinned: boolean;
    status: string;
    username: string;
    profile_image: string;
    parent_comment_id: string;
    reply_list: Replies;
}

interface EventContent {
    comment_action: string;
    comment_id: string;
    comment_type: string;
    parent_comment_id: string;
    timestampe: number;
    video_id: string;
}

export interface TikTokEvent {
    client_id: string;
    content: EventContent;
    create_time: number;
    event: string;
    user_openid: string;
}
