const child_process = require('child_process');

const appPackage = require('../package.json');

child_process.execSync(
    `sentry-cli releases new ${appPackage.version}`,
    (error, stdout, stderr) => {
        console.log(error, stdout, stderr);
    }
);

child_process.execSync(
    `sentry-cli releases files platform@${appPackage.version} upload-sourcemaps ./build`,
    (error, stdout, stderr) => {
        console.log(error, stdout, stderr);
    }
);

child_process.execSync(
    `sentry-cli releases finalize ${appPackage.version}`,
    (error, stdout, stderr) => {
        console.log(error, stdout, stderr);
    }
);
