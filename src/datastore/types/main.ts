export interface RefreshToken {
    token: string;
    create_time: number;
    expire_time: number;
}

export interface AccessToken {
    token: string;
}

export interface FirestoreConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
}

export interface SkippedComment {
    comment_id: string;
    reason: string;
    skipped_at: number;
    skipped_by_id: string;
    skipped_by_name: string;
}

export interface AIResponse {
    approved_at: number;
    comment_id: string;
    create_time: number;
    edited_at: number;
    responded_at: number;
    generated_response: string;
}
