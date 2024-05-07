import {Request, Response, NextFunction} from 'express';
import { ApyreService } from "../services/apyre.service";
export const apyreTokenMiddleware = (req: any, res: Response, next: NextFunction) => {
    const token = req.headers['x-access-token'];
    const refresh = req.headers['refresh-token'];
    if (!token || !refresh || typeof token !== 'string' || typeof refresh !== 'string') {
        res.status(403).send('Unauthorized');
    }
    const validAccessToken = ApyreService.verifyAccessToken(token as string);
    if (validAccessToken) {
        req.token = token as string;
        next();
    }
    const validRefreshToken = ApyreService.verifyAccessToken(token as string);
    if (!validRefreshToken) {
        res.status(403).send('Unauthorized');
    }
    ApyreService.refreshToken(refresh as string).then((renewedToken => {
        if (!renewedToken) throw new Error('Could not renew token.');
        req.token = renewedToken;
        next();
    })).catch(e => {
        console.error(e);
        res.status(403).send('Unauthorized');
    })
}