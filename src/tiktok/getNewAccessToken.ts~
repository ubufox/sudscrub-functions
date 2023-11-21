import fetch from 'node-fetch';

import { REFRESH_TOKEN_URL } from './endpoints';
import { AccessToken } from './types/main';
import { MockData } from './mock_data/main';

const mAccessToken: AccessToken = new MockData().at;

export const getNewAccessToken = async (refresh_token: string): Promise<AccessToken> => {
    if (process.env.NODE_ENV === 'dev') {
        return mAccessToken;
    }

    const client_id: string = 'abdcadfaoj';
    const client_secret: string = '13r67f8siodfhaiufb';
    const grant_type: string = 'refresh_token';

    const res = await fetch(
        `${REFRESH_TOKEN_URL}?client_id=${client_id}&client_secret=${client_secret}&grant_type=${grant_type}&refresh_token=${refresh_token}`,
        {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    if (res.status !== 200) {
        console.log("There was an issue requesting a new access token");
        throw new Error(`Request for a new access token return a ${res.status} status`); 
    }

    // We expect the response from the TikTok API to match our AccessToken Interface
    const newAccessToken: any = await res.json();

    return {
        access_token: newAccessToken?.access_token,
        expires_in: newAccessToken?.expires_in,
        refresh_token: newAccessToken?.refresh_token,
        refresh_token_expires_in: newAccessToken?.refresh_token_expires_in,
    }
};
