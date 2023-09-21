
// npm test -- tests/blog_api.test.js

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require("../models/blog");
const api = supertest(app)

const helper = require('./test_helper')


beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
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
  expect(response.body).toHaveLength(helper.initialBlogs.length)
  console.log(response.body)
})


test('The unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const blogName = response.body
  for (const blog of blogName) {
    expect(blog.id).toBeDefined()
   // console.log(blog.id)
  }
})


test('A valid blog can be added to the list in the database', async () => {
  const newBlog = {
    title: "A third test blog is added?",
    author: "Me",
    url: "www.thirdtestblog.com",
    likes: 9999,
  };
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  
  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  const titles = blogsAtEnd.map(r => r.title);
  expect(titles).toContain('A third test blog is added?');
});

test('A blog with 0 likes property receives the likes default to 0', async () => {
  const newBlog = {
    title: "A fourth test with 0 likes.",
    author: "notMe",
    url: "www.fourthtestblog.com",
  };
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  
  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1); 
  const { likes } = blogsAtEnd[blogsAtEnd.length - 1]; 
  expect(likes).toBe(0);
});



test('A blog without title or url is not added and 400 is responded' , async() => {
  const newBlog = {


    likes: 45
  };
 await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(400)
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })




  



afterAll(async () => {
  await mongoose.connection.close()
})




