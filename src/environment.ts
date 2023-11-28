declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TIKTOK_CLIENT_ID: string,
            TIKTOK_CLIENT_SECRET: string,
            REDIS_HOST: string,
            REDIS_PORT: string,
            NODE_ENV: 'dev' | 'prod';
        }
    }
}

export {}
