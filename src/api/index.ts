import Run from './runAPI';

const api = {
    run: new Run(
        process.env.NODE_ENV === 'test' ? undefined : 'http://api.lumi.run'
    )
};
export default api;
