import request from 'supertest'
import app from '../../build/app'

process.env.NODE_ENV = 'test';

test('Get self user path', (done) => {
    request(app)
        .get('/api/me')
        .expect(401, done)
})

test('Post check endpoint for update password', (done) => {
    request(app)
        .post('/api/me/update-password')
        .expect(401, done)
})