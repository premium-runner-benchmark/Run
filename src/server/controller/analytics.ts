import _path from 'path';

import * as H5P from 'h5p-nodejs-library';

import Logger from '../helper/Logger';
import { trackEvent } from '../helper/track';

import LumiError from '../helper/Error';

import DB from '../db';

import { IAnalytics } from '../types';

const log = new Logger('controller:analytics');

export class AnalyticsController {
    constructor(db: DB) {
        this.db = db;
    }

    private db: DB;

    public async get(analyticsId: string): Promise<IAnalytics> {
        return this.db.getAnalytics(analyticsId);
    }

    public async process(h5pId: string, data: IAnalytics): Promise<void> {
        trackEvent('run', 'completed');
        await this.db.saveAnalytics(h5pId, data);
        return;
    }
}

export default AnalyticsController;
