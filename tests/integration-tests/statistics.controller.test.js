import request from 'supertest'
import { JS_JSX_EXTENSIONS } from 'ts-jest';
import app from '../../build/app'

process.env.NODE_ENV = 'test';

test('Get most liked users path', (done) => {
    request(app)
        .get('/api/most-liked')
        .expect(200, done)
})