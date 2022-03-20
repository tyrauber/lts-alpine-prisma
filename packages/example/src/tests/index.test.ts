import request from 'supertest'
import app from '../index'

describe('Test example', () => {
  test('GET /', async () => {
    const res = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(res.body[0]?.now).not.toBeNull
  })
})
