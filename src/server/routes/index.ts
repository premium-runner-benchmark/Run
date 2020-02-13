import express from 'express';

import AnalyticsController from '../controller/analytics';
import H5PController from '../controller/h5p';

import LumiError from '../helper/Error';
import Logger from '../helper/Logger';

import DB from '../db';

const log = new Logger('routes');

export default function(db: DB): express.Router {
    const router = express.Router();

    log.info('setting up routes');

    const h5pcontroller = new H5PController(db);
    const analyticsController = new AnalyticsController(db);

    router.get(
        '/v0/h5p',
        (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            h5pcontroller
                .load(req.query.id)
                .then(page => res.status(200).json(page))
                .catch(error => next(error));
        }
    );

    router.get(
        '/v0/h5p/render',
        (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            h5pcontroller
                .render(req.query.id)
                .then(page => res.status(200).end(page))
                .catch(error => next(error));
        }
    );

    router.post(
        `/v0/h5p`,
        (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            if (
                !(req as any).files ||
                !(req as any).files.h5p ||
                !(req as any).files.h5p.data
            ) {
                next(new LumiError('h5p-not-valid', 'H5P not valid', 400));
            }
            h5pcontroller
                .import((req as any).files.h5p.data)
                .then(result => {
                    res.status(201).json(result);
                })
                .catch(error => next(error));
        }
    );

    router.post(
        `/v0/analytics`,
        (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            analyticsController
                .process(req.query.h5p_id, req.body)
                .then(result => {
                    res.status(200).json(result);
                })
                .catch(error => next(error));
        }
    );

    router.get(
        `/v0/analytics`,
        (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            analyticsController
                .get(req.query.id)
                .then(result => {
                    res.status(200).json(result);
                })
                .catch(error => next(error));
        }
    );

    return router;
}
