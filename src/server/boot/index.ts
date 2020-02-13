import Sentry from './Sentry';

import Logger from '../helper/Logger';

Sentry.captureMessage('booting', Sentry.Severity.Info);

import DB from '../db';
import H5P from '../h5p';
import App from './App';
import http from './http';
import MongoDB from './mongodb';
import S3 from './s3';

const log = new Logger('boot:index');

(async () => {
    log.info('start');
    const mongodb = await MongoDB();
    const s3 = await S3();
    const h5p = await H5P(s3, mongodb.collection('h5p'));

    const db = new DB(s3, mongodb, h5p);

    const app = await App(db);

    const server = http.createServer(app);

    server.listen(process.env.PORT || 80, () => {
        log.info(`server booted on port ${process.env.PORT || 80}`);
    });
})();
