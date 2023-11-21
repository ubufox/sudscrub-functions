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
