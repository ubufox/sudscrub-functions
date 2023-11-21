import { AccessToken } from '../types/main';

export class MockData {
    at: AccessToken;

    constructor() {
        this.at = {
            access_token: 'abcd',
            expires_in: 86400,
            refresh_token: 'dcba',
            refresh_token_expires_in: 86400,
        }
    }
}
