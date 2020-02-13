import AWS from 'aws-sdk';
import LumiError from '../helper/Error';

export default async () => {
    if (!process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_ID) {
        throw new LumiError(
            'aws-credentials',
            'AWS_ACCESS_KEY or AWS_SECRET_ID missing',
            500
        );
    }
    return new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ID,
        signatureVersion: 'v4'
    });
};
