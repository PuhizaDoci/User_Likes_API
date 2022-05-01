import request from 'supertest'
import app from '../../build/app'

process.env.NODE_ENV = 'test';

test('Get login page', (done) => {
    request(app)
        .post('/api/login')
        .expect(200, done)
})

test('Get sign up page', (done) => {
    request(app)
        .post('/api/signup')
        .expect(200, done)
})