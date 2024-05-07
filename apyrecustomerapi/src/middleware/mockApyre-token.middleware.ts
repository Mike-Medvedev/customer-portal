import {Request, Response, NextFunction} from 'express';
import { mockApyreService } from "../services/mockApyre.service";
export const mockApyreTokenMiddleware = (req: any, res: Response, next: NextFunction) => {

    if (req.path === '/get-magic-link' || '/verify-magic-link' || 'exchange-magic-link' || '/get-test-data') {
        return next();
    }
    console.log('THIS IS COMING FROM MIDDLEWAREEEE!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    const token = req.headers['x-access-token'];
    const refresh = req.headers['refresh-token'];
    console.log('printing out acess token from middleware: ' + token)
    if (!token || !refresh || typeof token !== 'string' || typeof refresh !== 'string') {
        res.status(403).send('Unauthorized');
    }
    const validAccessToken = mockApyreService.verifyAccessToken(token as string);
    if (validAccessToken) {
        req.token = token as string;
        next();
    }
    else {res.status(401).send('Unauthorized');}
    const validRefreshToken = mockApyreService.verifyAccessToken(token as string);
    if (!validRefreshToken) {
        res.status(403).send('Unauthorized');
    }
    try {
        const renewedToken = mockApyreService.refreshToken(refresh as string);
        if (!renewedToken) {
            throw new Error('Could not renew token.');
        }
        req.token = renewedToken;
        next();
    } catch (e) {
        console.error(e);
        res.status(403).send('Unauthorized');
    }
    // mockApyreService.refreshToken(refresh as string).then((renewedToken => {
    //     if (!renewedToken) throw new Error('Could not renew token.');
    //     req.token = renewedToken;
    //     next();
    // })).catch(e => {
    //     console.error(e);
    //     res.status(403).send('Unauthorized');
    // })
}