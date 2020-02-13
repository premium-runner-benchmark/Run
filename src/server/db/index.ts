import * as H5P from 'h5p-nodejs-library';

import MongoDB from 'mongodb';
import shortid from 'shortid';

import LumiError from '../helper/Error';

import AWS from 'aws-sdk';
import User from '../h5p/User';

import { IAnalytics } from '../types';

export default class DB {
    constructor(s3: AWS.S3, mongodb: MongoDB.Db, h5p: H5P.H5PEditor) {
        this.h5p = h5p;
        this.mongodb = mongodb;
        this.s3 = s3;
    }

    private h5p: H5P.H5PEditor;
    private mongodb: MongoDB.Db;
    private s3: AWS.S3;

    public async createAnalytics(h5pId: string): Promise<string> {
        try {
            const id = shortid();
            await this.mongodb.collection('analytics').insertOne({
                _id: id,
                created_at: new Date().getTime(),
                data: [],
                h5p_id: h5pId
            });

            return id;
        } catch (error) {
            throw new LumiError('db', error.message, 500);
        }
    }

    public async getAnalytics(analyticsId: string): Promise<IAnalytics> {
        const result = await this.mongodb.collection('analytics').findOne({
            _id: analyticsId
        });

        if (!result) {
            throw new LumiError(
                'analytics-not-found',
                'Metrics with that id not found',
                404
            );
        }
        return result;
    }

    public async loadH5P(
        id: string
    ): Promise<{
        metadata: H5P.IContentMetadata;
        parameters: object;
    }> {
        try {
            const { parameters, metadata } = await this.mongodb
                .collection('h5p')
                .findOne({
                    _id: parseInt(id, 10)
                });

            if (!parameters || !metadata) {
                throw new LumiError('h5p-not-found', '', 404);
            }
            return {
                metadata,
                parameters
            };
        } catch (error) {
            throw new LumiError('h5p-not-found', error.message, 404);
        }
    }

    public async loadLibrary(
        id: string,
        machineName: string,
        majorVersion: number,
        minorVersion: number
    ): Promise<any> {
        const library = await this.s3
            .getObject({
                Bucket: 'lumi',
                Key: `h5p/libraries/${machineName}-${majorVersion}.${minorVersion}/library.json`
            })
            .promise();

        return JSON.parse((library as any).Body.toString());
    }

    public async saveAnalytics(h5pId: string, data: IAnalytics): Promise<void> {
        await this.mongodb.collection('analytics').updateOne(
            {
                h5p_id: parseInt(h5pId, 10)
            },
            {
                $push: { data },
                $set: { accessed_at: new Date().getTime() }
            }
        );

        return;
    }

    public async saveH5P(
        parameters: any,
        metadata: H5P.IContentMetadata,
        library: string
    ): Promise<string> {
        return this.h5p.saveH5P(
            undefined,
            parameters,
            metadata,
            library,
            new User()
        );
    }

    public async uploadPackage(
        file: Buffer
    ): Promise<{
        metadata: H5P.IContentMetadata;
        parameters: any;
    }> {
        return this.h5p.uploadPackage(file, new User());
    }
}
