import {Firestore, QueryDocumentSnapshot} from '@google-cloud/firestore';

import { RefreshToken, AccessToken } from './types/main';
import { MockData } from './mock_data/main';

let mockData: MockData = new MockData();

export class RefreshTokenC {
    token: string;
    create_time: number;
    expire_time: number;
    
    constructor(
        token: string,
        create_time: number,
        expire_time: number) {
    
        this.token = token;
        this.create_time = create_time;
        this.expire_time = expire_time;
    }
}

const getLatestFromCollection = (c: FirebaseFirestore.QuerySnapshot): RefreshToken => {
    const data = c.docs.pop()?.data();

    if (typeof(data) !== 'undefined') {
        return new RefreshTokenC(data.token, data.create_time, data.expire_time);
    }

    throw new Error('Unable to retrieve a refresh token');
}

export const getRefreshToken = async (f: Firestore): Promise<RefreshToken> => {
    if (process.env.NODE_ENV === 'dev') {
        return mockData.rt;
    }

    const collectionReference = f.collection('refresh-token');

    // Get the newest refresh token
    const refreshTokens = await collectionReference
        .orderBy('create_time')
        .limit(1)
        .get();
    
    return getLatestFromCollection(refreshTokens);
};

