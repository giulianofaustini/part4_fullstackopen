
// npm test -- tests/blog_api.test.js

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require("../models/blog");
const api = supertest(app)

const initialBlogs = [
  {
    title: 'The first thest blog.',
    author: 'Not me',
    url: 'www.firstTestBlog.com',
    like: '23',
    id: '650bdcf451d9d807739f6f57'
  },
  {
    title: 'The Second Test Blog EFFF',
    author: 'not me',
    url: 'www.testthis.com',
    likes: 45,
    id: '650bdddf51d9d807739f6f58'
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('Blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are ? blogs', async () => {
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


test('A valid blog can be added to the list in the databse' , async() => {
const newBlog = {
  title: "A third test blog is add?",
  author: "Me",
  url: "www.thirdtestblog.com",
  likes: 9999,
};
await api
.post('/api/blogs')
.send(newBlog)
.expect(201)
.expect('Content-Type', /application\/json/)
const response = await api.get('/api/blogs')
const titles = response.body.map(r => r.title)
expect(response.body).toHaveLength(initialBlogs.length + 1)
expect(titles).toContain('A third test blog is add?')
})


test('A blog with likes property receives the likes to default O' , async() => {
  const newBlog = {
    title: "A fourth test with 0 likes.",
    author: "notMe",
    url: "www.fourthtestblog.com",
  };
 const response = await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(201)
  .expect('Content-Type', /application\/json/)
   const {likes} = response.body
  expect(likes).toBe(0)
  })

afterAll(async () => {
  await mongoose.connection.close()
})