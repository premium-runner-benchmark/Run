import _path from 'path';

import * as H5P from 'h5p-nodejs-library';

import Logger from '../helper/Logger';

import LumiError from '../helper/Error';

import DB from '../db';

import Renderer from '../h5p/Player.renderer';

const log = new Logger('controller');

export class H5PController {
    constructor(db: DB) {
        this.db = db;
    }

    private db: DB;

    public async import(
        file: Buffer
    ): Promise<{
        analytics_id: string;
        h5p_id: string;
    }> {
        if (!file) {
            throw new LumiError(
                'h5p-not-valid',
                'H5P could not be validated',
                400
            );
        }

        const { parameters, metadata } = await this.db.uploadPackage(file);

        const id = await this.db.saveH5P(
            parameters,
            metadata,
            this.getUbernameFromH5pJson(metadata)
        );

        const analyticsId = await this.db.createAnalytics(id);

        return {
            analytics_id: analyticsId,
            h5p_id: id
        };
    }

    public async load(
        id: string
    ): Promise<{
        id: string;
        metadata: H5P.IContentMetadata;
        parameters: any;
    }> {
        const { parameters, metadata } = await this.db.loadH5P(id);

        return {
            id,
            metadata,
            parameters
        };
    }

    public async render(
        id: string,
        useTemplate: boolean = false
    ): Promise<string> {
        log.info(`rendering package with id ${id}`);

        const libraryLoader = (machineName, majorVersion, minorVersion) =>
            this.db.loadLibrary(id, machineName, majorVersion, minorVersion);

        const player = new H5P.H5PPlayer(
            libraryLoader as any,
            {
                baseUrl: `https://lumi.s3.eu-central-1.amazonaws.com/run`,
                libraryUrl: `https://lumi.s3.eu-central-1.amazonaws.com/h5p/libraries`,
                scriptUrl: `https://lumi.s3.eu-central-1.amazonaws.com/h5p/core/js`,
                stylesUrl: `https://lumi.s3.eu-central-1.amazonaws.com/h5p/core/styles`
            },
            {
                ajax: {
                    contentUserData: `http://api.lumi.run/v0/analytics?h5p_id=${id}`,
                    setFinished: `http://api.lumi.run/v0/analytics?h5p_id=${id}`
                },
                postUserStatistics: true
            } as any,
            null
        );

        const h5package = await this.db.loadH5P(id);

        if (!h5package) {
            throw new LumiError('h5p-not-found', '', 404);
        }

        player.useRenderer(Renderer);

        return player.render(id, h5package.parameters, h5package.metadata);
    }

    private getUbernameFromH5pJson(h5pJson: H5P.IContentMetadata): string {
        const library = (h5pJson.preloadedDependencies || []).find(
            dependency => dependency.machineName === h5pJson.mainLibrary
        );
        if (!library) {
            return '';
        }
        return H5P.LibraryName.toUberName(library, { useWhitespace: true });
    }
}

export default H5PController;
