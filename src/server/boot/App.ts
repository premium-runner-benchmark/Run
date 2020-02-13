import * as Sentry from '@sentry/node';
import bodyParser from 'body-parser';
import express from 'express';
import fileUpload from 'express-fileupload';

import DB from '../db';

import Routes from './Routes';
import Swagger from './Swagger';

export default async function(db: DB): Promise<express.Application> {
    const app = express();
    app.use(Sentry.Handlers.requestHandler());

    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(
        bodyParser.urlencoded({
            extended: true,
            limit: '50mb'
        })
    );

    app.use(
        fileUpload({
            limits: { fileSize: 10 * 1024 * 1024 }
        })
    );

    await Swagger(app);

    Routes(app, db);

    app.use(Sentry.Handlers.errorHandler());

    app.use((error, req, res, next) => {
        Sentry.captureException(error);
        res.status(error.status || 500).json({
            code: error.code,
            message: error.message,
            status: error.status
        });
    });

    return app;
}
