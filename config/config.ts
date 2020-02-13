const data = process.env.DATA;

export default {
    storage: `${data}/storage.json`,
    temporaryStoragePath: `${data}/tmp`
};
