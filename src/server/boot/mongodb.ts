import { MongoClient } from 'mongodb';

import Logger from '../helper/Logger';

const log = new Logger('boot:mongodb');

export default async () => {
    try {
        log.info(`connecting to ${process.env.MONGODB_URL}`);

        const auth = process.env.MONGODB_USER
            ? {
                  password: process.env.MONGODB_PASSWORD,
                  user: process.env.MONGODB_USER
              }
            : undefined;

        const client = await MongoClient.connect(process.env.MONGODB_URL, {
            auth
        });

        log.info('connection successful');
        return client.db(process.env.MONGODB_DB);
    } catch (error) {
        log.error(error);
    }
};
