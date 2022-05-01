import request from 'supertest'
import app from '../../build/app'

process.env.NODE_ENV = 'test';

test('Get number of likes', (done) => {
    request(app)
        .get('/api/user/1')
        .expect(200, done)
})

test('Get like path', (done) => {
    request(app)
        .post('/api/user/1/like')
        .expect(401, done)
})

test('Get unlike path', (done) => {
    request(app)
        .post('/api/user/1/unlike')
        .expect(401, done)
})