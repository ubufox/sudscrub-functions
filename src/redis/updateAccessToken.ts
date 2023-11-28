import { RedisClientType } from 'redis';

import { REDIS_KEY } from './consts';

export const updateAccessToken = async (redisClient: RedisClientType, at: string) => {
    return await redisClient.set(REDIS_KEY, at);
};
