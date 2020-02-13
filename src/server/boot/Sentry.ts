import * as Sentry from '@sentry/node';

import appPackage from '../../../package.json';

if (process.env.NODE_ENV === 'production') {
    Sentry.init({
        dsn: 'https://74bc923abcf24770b963f438f4981331@sentry.io/1857623',
        release: appPackage.version
    });
}

process.on('unhandledRejection', error => {
    if (process.env.NODE_ENV === 'development') {
        // tslint:disable-next-line: no-debugger
        debugger;
    }
    Sentry.captureException(error);
});

process.on('uncaughtException', error => {
    if (process.env.NODE_ENV === 'development') {
        // tslint:disable-next-line: no-debugger
        debugger;
    }
    Sentry.captureException(error);
});

export default Sentry;
