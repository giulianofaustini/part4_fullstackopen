
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

test('The unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const blogName = response.body
  for (const blog of blogName) {
    expect(blog.id).toBeDefined()
    console.log(blog.id)
  }
})

afterAll(async () => {
  await mongoose.connection.close()
})