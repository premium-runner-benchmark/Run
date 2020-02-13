import express from 'express';

import DB from '../db';
import routes from '../routes';

import * as H5P from 'h5p-nodejs-library';

export default function boot(
    app: express.Application,
    db: DB
): express.Application {
    app.use('/', routes(db));
    return app;
}
