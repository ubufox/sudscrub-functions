import { REFRESH_TOKEN_URL } from './endpoints';
import { AccessToken } from './types/main';

export const getNewAccessToken = async (refresh_token: string): Promise<AccessToken> => {
    const client_id: string  = process.env.TIKTOK_CLIENT_ID;
    const client_secret: string = process.env.TIKTOK_CLIENT_SECRET;
    const grant_type: string = 'refresh_token';

    const body = {
        client_id,
        client_secret,
        grant_type,
        refresh_token,
    };

    const res = await fetch(REFRESH_TOKEN_URL,
        {
            body: JSON.stringify(body),
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
    // based on the TikTok API documentation
    const newAccessToken: any = await res.json();

    if (typeof newAccessToken?.data?.access_token === 'undefined') {
        throw new Error('Failed request to TikTok API');
    }

    console.log("new token ->");
    console.log(newAccessToken);

    return {
        access_token: newAccessToken?.data?.access_token,
        expires_in: newAccessToken?.data?.expires_in,
        refresh_token: newAccessToken?.data?.refresh_token,
        refresh_token_expires_in: newAccessToken?.data?.refresh_token_expires_in,
    }
};
