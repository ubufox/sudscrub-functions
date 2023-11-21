import { RefreshToken, AccessToken } from '../types/main';

export class MockData {
    rt: RefreshToken;
    at: AccessToken;

    constructor() {
        this.rt = {
            token: 'abc',
            create_time: 1234,
            expire_time: 1235
        };
        this.at = {
            token: 'abcd',
        };
    }
}
