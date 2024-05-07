//Requires installing express and axios:  npm i axios express

import {readFileSync} from 'fs';
import path from 'path';
import axios from 'axios';
import {verify} from 'jsonwebtoken';
import {Request} from 'express';

class _ApyreService {
    private static _instance?: _ApyreService;
    static get instance(): _ApyreService {
        if (!_ApyreService._instance) {
            this._instance = new _ApyreService();
        }
        return this._instance!;
    }
    base_uri = "http://127.0.0.1:5001/apyre-dev/us-central1"; //https://us-central1-apyre-dev.cloudfunctions.net
    customer_token_public_key: string;
    customer_refresh_public_key: string;
    constructor() {
        this.customer_token_public_key = readFileSync(path.join(__dirname, './apyre-customer-token-key.pub')).toString();
        this.customer_refresh_public_key = readFileSync(path.join(__dirname, './apyre-customer-refresh-key.pub')).toString();
    }

    verifyAccessToken(token: string): {email: string, case: string} | null {
        try {
            const payload = verify(token, this.customer_token_public_key);
            const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
            return parsed as {email: string, case: string};
        } catch (e) {
            return null;
        }
    }

    verifyRefreshToken(token: string): {code: string, email: string} | null {
        try {
            const payload = verify(token, this.customer_refresh_public_key);
            const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
            return parsed as {code: string, email: string};
        } catch (e) {
            return null;
        }
    }

    /**
     * 
     * @param refreshToken 
     * @returns A valid access token. Or errors out.
     */
    refreshToken(refreshToken: string): Promise<string> {
        if (!refreshToken) throw new Error('No refresh token provided');
        return axios.get(this.base_uri + '/refreshCustomerToken', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.APYRE_API_KEY,
                'refresh-token': refreshToken
            }
        }).then((response) => {
            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error(response.statusText);
            }
        }).catch(e => {
            console.error(e);
            throw e.message ?? 'refreshToken failed.'
        })
    }

    sendMagicLink(email: string) {
        return axios.post(this.base_uri + '/sendMagicLink', {
            email
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.APYRE_API_KEY
            }
        }).then((response) => {
            return response.status
        }).catch(e => {
            console.error(e);
            throw e.message ?? 'sendMagicLink failed.'
        })
    }

    exchangeMagicLinkCodeForTokens(code: string): Promise<{token: string, refresh: string}> {
        return axios.post(this.base_uri + '/exchangeLink', {
            code
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.APYRE_API_KEY
            }
        }).then((response) => {
            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error(response.statusText);
            }
        }).catch(e => {
            console.error(e);
            throw e.message ?? 'exchangeMagicLinkForTokens failed.'
        })
    }

    /**
     * 
     * @returns A message from the Apyre indicating that all authenication has passed.
     */
    makeTestCallToApyreServer(req: Request & {token: string}): Promise<string> {
        const token = req.token;
        if (!token) throw new Error('No token on request object.');
        return axios.get(this.base_uri + '/testCustomerAccess', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.APYRE_API_KEY,
                'x-access-token': token
            }
        }).then((response) => {
            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error(response.statusText);
            }
        }).catch(e => {
            console.error(e);
            throw e.message ?? 'refreshToken failed.'
        })
    }

}

export const ApyreService = _ApyreService.instance;

