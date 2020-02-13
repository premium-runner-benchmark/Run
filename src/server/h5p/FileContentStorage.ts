import { ReadStream } from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';

import MongoDB from 'mongodb';

import shortid from 'shortid';

import { Stream } from 'stream';

import {
    ContentId,
    IContentMetadata,
    IContentStorage,
    IUser,
    Permission
} from 'h5p-nodejs-library';

import AWS from 'aws-sdk';

/**
 * Persists content to the disk.
 */
export default class FileContentStorage implements IContentStorage {
    constructor(s3: AWS.S3, mongodb: MongoDB.Collection) {
        this.s3 = s3;
        this.db = mongodb;
    }

    private db: MongoDB.Collection;
    private s3: AWS.S3;

    /**
     * Adds a content file to an existing content object. The content object has to be created with createContent(...) first.
     * @param {ContentId} id The id of the content to add the file to
     * @param {string} filename The filename
     * @param {Stream} stream A readable stream that contains the data
     * @param {User} user The user who owns this object
     * @returns {Promise<void>}
     */
    public async addContentFile(
        id: ContentId,
        filename: string,
        stream: Stream,
        user: IUser
    ): Promise<void> {
        this.checkFilename(filename);

        await this.s3
            .upload({
                ACL: 'public-read',
                Body: stream,
                Bucket: 'lumi',
                Key: `run/content/${id}/${filename}`
            })
            .promise();
    }

    /**
     * Checks if a piece of content exists in storage.
     * @param contentId the content id to check
     * @returns true if the piece of content exists
     */
    public async contentExists(contentId: ContentId): Promise<boolean> {
        return true;
    }

    /**
     * Checks if a file exists.
     * @param contentId The id of the content to add the file to
     * @param filename the filename of the file to get
     * @returns true if the file exists
     */
    public async contentFileExists(
        contentId: ContentId,
        filename: string
    ): Promise<boolean> {
        this.checkFilename(filename);
        return new Promise((resolve, reject) => {
            this.s3
                .getObject({
                    Bucket: 'lumi',
                    Key: `run/${contentId}/${filename}`
                })
                .promise()
                .then(() => {
                    resolve(true);
                })
                .catch(error => {
                    resolve(false);
                });
        });
    }

    /**
     * Creates a content object in the repository. Add files to it later with addContentFile(...).
     * Throws an error if something went wrong. In this case no traces of the content are left in storage and all changes are reverted.
     * @param {any} metadata The metadata of the content (= h5p.json)
     * @param {any} content the content object (= content/content.json)
     * @param {User} user The user who owns this object.
     * @param {ContentId} id (optional) The content id to use
     * @returns {Promise<ContentId>} The newly assigned content id
     */
    public async createContent(
        metadata: IContentMetadata,
        content: any,
        user: IUser,
        id?: ContentId
    ): Promise<ContentId> {
        if (id === undefined || id === null) {
            // tslint:disable-next-line: no-parameter-reassignment
            id = await this.createContentId();
        }
        try {
            this.db.insertOne({
                metadata,
                // tslint:disable-next-line: object-literal-sort-keys
                _id: id,
                parameters: content
            });
        } catch (error) {
            throw new Error(`Could not create content: ${error.message}`);
        }
        return id;
    }

    /**
     * Generates a unique content id that hasn't been used in the system so far.
     * @returns {Promise<ContentId>} A unique content id
     */
    public async createContentId(): Promise<ContentId> {
        let counter = 0;
        let id;
        let exists = false;
        do {
            id = Math.round(Math.random() * 100000);
            counter += 1;
            exists = await this.db.findOne({
                _id: id
            });
        } while (exists && counter < 5); // try 5x and give up then
        if (exists) {
            throw new Error('Could not generate id for new content.');
        }
        return id;
    }

    /**
     * Deletes a content object and all its dependent files from the repository.
     * Throws errors if something goes wrong.
     * @param {ContentId} id The content id to delete.
     * @param {User} user The user who wants to delete the content
     * @returns {Promise<void>}
     */
    public async deleteContent(id: ContentId, user?: IUser): Promise<void> {
        return;
        // if (
        //     !(await fsExtra.pathExists(
        //         path.join(this.contentPath, id.toString())
        //     ))
        // ) {
        //     throw new Error(
        //         `Cannot delete content with id ${id}: It does not exist.`
        //     );
        // }

        // await fsExtra.remove(path.join(this.contentPath, id.toString()));
    }

    /**
     * Deletes a file from a content object.
     * @param contentId the content object the file is attached to
     * @param filename the file to delete
     */
    public async deleteContentFile(
        contentId: ContentId,
        filename: string
    ): Promise<void> {
        return;
        // this.checkFilename(filename);
        // const absolutePath = path.join(
        //     this.contentPath,
        //     contentId.toString(),
        //     filename
        // );
        // if (!(await fsExtra.pathExists(absolutePath))) {
        //     throw new Error(
        //         `Cannot delete file ${filename} from content id ${contentId}: It does not exist.`
        //     );
        // }
        // await fsExtra.remove(absolutePath);
    }

    /**
     * Gets the filenames of files added to the content with addContentFile(...) (e.g. images, videos or other files)
     * @param contentId the piece of content
     * @param user the user who wants to access the piece of content
     * @returns a list of files that are used in the piece of content, e.g. ['image1.png', 'video2.mp4']
     */
    public async getContentFiles(
        contentId: ContentId,
        user: IUser
    ): Promise<string[]> {
        return [];
        // const contentDirectoryPath = path.join(
        //     this.contentPath,
        //     contentId.toString()
        // );
        // const absolutePaths = await globPromise(
        //     path.join(contentDirectoryPath, '**', '*.*'),
        //     {
        //         ignore: [
        //             path.join(contentDirectoryPath, 'content.json'),
        //             path.join(contentDirectoryPath, 'h5p.json')
        //         ],
        //         nodir: true
        //     }
        // );
        // return absolutePaths.map(p => path.relative(contentDirectoryPath, p));
    }

    /**
     * Returns a readable stream of a content file (e.g. image or video) inside a piece of content
     * @param {ContentId} id the id of the content object that the file is attached to
     * @param {string} filename the filename of the file to get
     * @param {User} user the user who wants to retrieve the content file
     * @returns {Stream}
     */
    public getContentFileStream(
        id: ContentId,
        filename: string,
        user: IUser
    ): ReadStream {
        this.checkFilename(filename);

        return fsExtra.createReadStream(path.join('abc', id, filename));
    }

    /**
     * Returns an array of permissions that the user has on the piece of content
     * @param contentId the content id to check
     * @param user the user who wants to access the piece of content
     * @returns the permissions the user has for this content (e.g. download it, delete it etc.)
     */
    public async getUserPermissions(
        contentId: ContentId,
        user: IUser
    ): Promise<Permission[]> {
        return [
            Permission.Delete,
            Permission.Download,
            Permission.Edit,
            Permission.Embed,
            Permission.View
        ];
    }

    private checkFilename(filename: string): void {
        if (/\.\.\//.test(filename)) {
            throw new Error(
                `Relative paths in filenames are not allowed: ${filename} is illegal`
            );
        }
        if (filename.startsWith('/')) {
            throw new Error(
                `Absolute paths in filenames are not allowed: ${filename} is illegal`
            );
        }
    }
}
