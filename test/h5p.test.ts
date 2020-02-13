import supertest from 'supertest';

import App from '../src/server/boot/App';
import DB from '../src/server/db';

import LumiError from '../src/server/helper/Error';

jest.mock('../src/server/db');

describe('H5P', () => {
    describe('GET /v0/h5p?id=<h5p_id>', () => {
        it('returns status 400 when id was missing', async done => {
            const res = await supertest(await App(null)).get(`/v0/h5p`);
            expect(res.status).toBe(400);
            done();
        });

        it('returns status 404 when no H5P with that id was found', async done => {
            const id = 12356;
            const db = new DB(null, null, null);
            const dbLoadH5P = jest
                .spyOn(db, 'loadH5P')
                .mockImplementation(() =>
                    Promise.reject(new LumiError('h5p-not-found', '', 404))
                );

            const res = await supertest(await App(db)).get(`/v0/h5p?id=${id}`);

            expect(dbLoadH5P).toBeCalledWith(id);
            expect(res.status).toBe(404);
            expect(res.body.code).toBe('h5p-not-found');
            done();
        });
    });

    describe('POST /v0/h5p', () => {
        describe('wrong user-input', () => {
            it('returns status 400 when no H5P-file was submitted', async done => {
                const res = await supertest(await App(null)).post(`/v0/h5p`);

                expect(res.status).toBe(400);
                done();
            });
        });

        describe('failure', () => {
            let res;
            const db = new DB(null, null, null);
            const h5pUploadPackage = jest.spyOn(db, 'uploadPackage');

            const errorCode = 'test';
            const errorStatus = 500;

            h5pUploadPackage.mockImplementation(
                () =>
                    Promise.reject(
                        new LumiError(errorCode, '', errorStatus)
                    ) as any
            );

            beforeEach(() => {
                h5pUploadPackage.mockClear();
            });
            beforeAll(async () => {
                res = await supertest(await App(db))
                    .post(`/v0/h5p`)
                    .attach('h5p', `${__dirname}/data/test.h5p`);
            });

            it('returns the correct error-code and status', () => {
                expect(res.status).toBe(errorStatus);
                expect(res.body.code).toBe(errorCode);
            });
        });

        describe('success', () => {
            let res;
            const db = new DB(null, null, null);

            const h5pUploadPackage = jest.spyOn(db, 'uploadPackage');
            const h5pSaveH5P = jest.spyOn(db, 'saveH5P');
            const createAnalytics = jest.spyOn(db, 'createAnalytics');

            h5pUploadPackage.mockImplementation(
                () =>
                    Promise.resolve({
                        metadata: { metadata: 'mock' },
                        parameters: { parameters: 'mock' }
                    }) as any
            );

            h5pSaveH5P.mockImplementation(() => Promise.resolve('h5p_id'));

            createAnalytics.mockImplementation(() =>
                Promise.resolve('analytics_id')
            );

            beforeAll(async () => {
                res = await supertest(await App(db))
                    .post(`/v0/h5p`)
                    .attach('h5p', `${__dirname}/data/test.h5p`);
            });

            it('returns status 201 when a valid H5P was submitted', () => {
                expect(res.status).toBe(201);
            });

            it('returns an analytics id in the body', () => {
                expect(res.body.analytics_id).toBe('analytics_id');
            });

            it('returns a h5p id in the body', () => {
                expect(res.body.h5p_id).toBe('h5p_id');
            });
        });
    });
});
