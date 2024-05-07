import { Request } from 'express';
import { sign, verify } from 'jsonwebtoken'
import * as fs from 'fs';
import axios from 'axios'
import * as crypto from 'crypto';
import {config} from "dotenv";
import { jwtDecrypt } from 'jose';
config();

class MockApyreService {
    private static _instance?: MockApyreService;

    static get instance(): MockApyreService {
        if (!MockApyreService._instance) {
            MockApyreService._instance = new MockApyreService();
        }
        return MockApyreService._instance!;
    }


    publicKey = process.env.APYRE_PUBLIC_KEY as string;

    constructor() {}

    verifyAccessToken(token: string): {email: string, case: string} | null {
        const publicKeyPEM: string = fs.readFileSync('/Users/michaelmedvedev/Coding/keys/pubkeyfile.pem', 'utf8');

    const publicKey: crypto.KeyObject = crypto.createPublicKey(publicKeyPEM);
        try {
            const payload = verify(token, publicKey, { algorithms: ['RS256'] });
            const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
            return parsed as {email: string, case: string};
        } catch (e) {
            console.log('the error is: ' + e)
            throw e;
        }
    }

    verifyRefreshToken(token: string): { code: string, email: string } | null {
        console.log(`Verifying Refresh Token:`)
        return { code: 'mockedCode', email: 'test@example.com' };
    }

    refreshToken(refreshToken: string): string {
        console.log(`Exchanging refresh token for access token: `)
        const privateKeyPEM: string = fs.readFileSync('/Users/michaelmedvedev/Coding/keys/keyfile.pem', 'utf8');
  const privateKey: crypto.KeyObject = crypto.createPrivateKey(privateKeyPEM);
        const token = sign( {email: 'yo'}, privateKey, {algorithm: 'RS256', expiresIn: 300 })
        return token;
    }

    sendMagicLink(email: string, token: string): Promise<number> {
        console.log(`Sending magic link to: ${email}`)
        console.log(`Magic Link sent: http://localhost:4200/prelim?token=${token}`)
        return Promise.resolve(200);
    }

    exchangeMagicLinkCodeForTokens(code: string): { token: string, refresh: string } {
        console.log(`Exchanging Magic link for access and refresh token from code:`)
        const privateKeyPEM: string = fs.readFileSync('/Users/michaelmedvedev/Coding/keys/keyfile.pem', 'utf8');
  const privateKey: crypto.KeyObject = crypto.createPrivateKey(privateKeyPEM);
        const accesstoken = sign( {email: 'yo'}, privateKey, {algorithm: 'RS256', expiresIn: 10 })
        const refreshtoken = sign({email: 'yo'}, privateKey, {algorithm: 'RS256', expiresIn: 3000})
        return { token: accesstoken, refresh: refreshtoken };
    }

    makeTestCallToApyreServer(req: Request & { token: string }): Promise<string> {
        const token = req.token;
        if (!token) throw new Error('No token on request object.');

        // Simulate making a test call to the Apyre server
        return Promise.resolve('Mocked test call result');
    }
}

export const mockApyreService = MockApyreService.instance;
