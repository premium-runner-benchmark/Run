// tslint:disable-next-line: no-submodule-imports
import config from '../../../config/config';
import EditorConfig from '../../../config/EditorConfig';

import * as H5P from 'h5p-nodejs-library';

import DirectoryTemporaryFileStorage from './DirectoryTemporaryFileStorage';
import FileContentStorage from './FileContentStorage';
import FileLibraryStorage from './FileLibraryStorage';
import JsonStorage from './JsonStorage';

import AWS from 'aws-sdk';
import MongoDB from 'mongodb';

const editorConfig = new EditorConfig(new JsonStorage());

export default async (s3: AWS.S3, db: MongoDB.Collection) =>
    new H5P.H5PEditor(
        new JsonStorage(config.storage),
        editorConfig,
        new FileLibraryStorage(config.temporaryStoragePath),
        new FileContentStorage(s3, db),
        new H5P.TranslationService(H5P.englishStrings),
        (library, file) =>
            `/api/v0/h5p/libraries/${library.machineName}-${library.majorVersion}.${library.minorVersion}/${file}`,
        new DirectoryTemporaryFileStorage(config.temporaryStoragePath)
    );
