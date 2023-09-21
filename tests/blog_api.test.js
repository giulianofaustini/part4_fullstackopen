
// npm test -- tests/blog_api.test.js

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('Blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are seven blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(2)
  console.log(response.body)

})

afterAll(async () => {
  await mongoose.connection.close()
})