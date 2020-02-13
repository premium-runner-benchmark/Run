export type ErrorCodes =
    | 'db'
    | 'aws-credentials'
    | 'test'
    | 'analytics-not-found'
    | 'h5p-not-found'
    | 'h5p-not-valid';

export default class LumiError {
    constructor(code: ErrorCodes, message?: string, status: number = 500) {
        this.code = code;
        this.message = message;
        this.status = status;
        this.error = new Error(message);
    }

    public code: ErrorCodes;
    public error: Error;
    public message: string;
    public status: number;
}
