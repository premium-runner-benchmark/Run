import shortid from 'shortid';
import supertest from 'supertest';

import App from '../src/server/boot/App';
import DB from '../src/server/db';

import LumiError from '../src/server/helper/Error';

jest.mock('../src/server/db');

describe('Analytics', () => {
    describe('GET /v0/analytics?id=...', () => {
        it('returns status 400 when id was missing', async done => {
            const db = new DB(null, null, null);

            const res = await supertest(await App(db)).get(`/v0/analytics`);
            expect(res.status).toBe(400);
            done();
        });

        it('returns status 404 when no Analytics with that id was found', async done => {
            const id = shortid();

            const db = new DB(null, null, null);
            const dbGetAnalyticsMock = jest
                .spyOn(db, 'getAnalytics')
                .mockImplementation(() =>
                    Promise.reject(
                        new LumiError(
                            'analytics-not-found',
                            'Analytics with that id not found',
                            404
                        )
                    )
                );

            const res = await supertest(await App(db)).get(
                `/v0/analytics?id=${id}`
            );

            expect(dbGetAnalyticsMock).toBeCalledWith(id);
            expect(res.status).toBe(404);
            expect(res.body.code).toBe('analytics-not-found');
            done();
        });

        it('returns the analytics', async done => {
            const id = shortid();

            const db = new DB(null, null, null);
            const dbGetAnalyticsMock = jest
                .spyOn(db, 'getAnalytics')
                .mockImplementation(() =>
                    Promise.resolve({
                        _id: id,
                        data: [],
                        h5p_id: 'test'
                    })
                );

            const res = await supertest(await App(db)).get(
                `/v0/analytics?id=${id}`
            );

            expect(dbGetAnalyticsMock).toBeCalledWith(id);
            expect(res.status).toBe(200);
            expect(res.body._id).toBe(id);
            expect(res.body.data).toEqual([]);
            expect(res.body.h5p_id).toBe('test');
            done();
        });
    });

    describe('POST /v0/analytics', () => {
        describe('wrong user-input', () => {
            it('returns status 400 when no analytics id was provided', async done => {
                const db = new DB(null, null, null);

                const res = await supertest(await App(db)).post(
                    `/v0/analytics`
                );

                expect(res.status).toBe(400);
                done();
            });
        });

        // describe('failure', () => {
        //     let res;
        //     const db = new DB(null, null, null);
        //     const saveAnalytics = jest.spyOn(db, 'saveAnalytics');

        //     const errorCode = 'analytics-not-found';
        //     const errorStatus = 404;

        //     saveAnalytics.mockImplementation(
        //         () =>
        //             Promise.reject(
        //                 new LumiError(errorCode, '', errorStatus)
        //             ) as any
        //     );

        //     beforeEach(() => {
        //         saveAnalytics.mockClear();
        //     });
        //     beforeAll(async () => {
        //         res = await supertest(await App(db)).post(
        //             `/v0/analytics?h5p_id=test`
        //         );
        //     });

        //     it('returns the correct error-code and status', () => {
        //         expect(res.status).toBe(errorStatus);
        //         expect(res.body.code).toBe(errorCode);
        //     });
        // });
    });
});
