import { Firestore } from '@google-cloud/firestore';

import { RefreshToken } from './types/main';

export const createRefreshToken = async (f:Firestore, rt: string, expires: number) => {
    const collectionReference = f.collection('refresh-token');

    const create_time: Date = new Date(Date.now());
    const expire_time: Date = new Date(create_time.getMilliseconds() + expires);

    return await collectionReference.add({
            token: rt,
            create_time,
            expire_time,
        })
        .catch((e) => {
            if (typeof e === 'string') {
                throw new Error(e);
            } else if (e instanceof Error) {
                throw new Error(e.message);
            } else {
                throw new Error("Undefined error when creating new refresh token");
            }
        });
}
