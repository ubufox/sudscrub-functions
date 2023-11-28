import { RedisClientType } from 'redis';

import { REDIS_KEY } from './consts';

export const getAccessToken = async (redisClient: RedisClientType): Promise<string> => {
    const access_token = await redisClient.get(REDIS_KEY);

    if (access_token === null) {
        throw new Error('Access token not found in the redis store');
    }

    return access_token;
};
