import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const start = Date.now();

        console.log('==============================');
        console.log(`${req.method} ${req.originalUrl}`);
        console.log('Body:', req.body);
        console.log('==============================');

        res.on('finish', () => {
            console.log('------------------------------');
            console.log(`${req.method} ${req.originalUrl}`);
            console.log('Status:', res.statusCode);
            console.log('------------------------------');
        });

        next();
    }
}