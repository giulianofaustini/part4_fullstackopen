
// npm test -- tests/blog_api.test.js

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require("../models/blog");
const api = supertest(app)

const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const jwt = require('jsonwebtoken');

let authToken

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);

  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({ username: 'Giacomo', passwordHash });
  await user.save();

  const userForToken = {
    username: user.username,
    id: user._id,
  };
  authToken = jwt.sign(userForToken, process.env.SECRET);
});

describe('when there is initially one user in db', () => {
  test('creation succeeds with a fresh username', async () => {
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const userForToken = {
      username: newUser.username,
      id: response.body.id,
    };
    let testToken = jwt.sign(userForToken, process.env.SECRET);

    expect(testToken).toBeDefined();
  });
});


describe('Where I have two blogs in the list', () => {
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
})

describe('Where blogs are added and if likes are missing, there is a default 0' , () => {
  test('adding a blog fails without a token', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testblog.com',
      likes: 10,
    };
    const response = await api.post('/api/blogs').send(newBlog).expect(401);
    expect(response.body.error).toContain('token missing or invalid');
    
  });
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
      .set('Authorization', `Bearer ${authToken}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    const titles = blogsAtEnd.map(r => r.title);
    expect(titles).toContain('A third test blog is added?');
  });
  test('A blog with 0 likes property receives the likes default to 0, and title and url are required', async () => {
    const newBlog = {
      title: "A fourth test with 0 likes.",
      author: "notMe",
      url: "www.fourthtestblog.com",
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${authToken}`)
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
})
// not required in the exercise 
describe('Where I delete or update a blog' , () => {
  // test('a blog can be deleted', async () => {
  //   const blogsAtStart = await helper.blogsInDb();
    
  //   const blogToDelete = blogsAtStart[0];
  
  //   await api
      
  //     .delete(`/api/blogs/${blogToDelete.id}`)
  //     .expect(204);
  
  //   const blogsAtEnd = await helper.blogsInDb();
  //   expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
  //   const titles = blogsAtEnd.map(r => r.title);
  //   expect(titles).not.toContain(blogToDelete.title);
  // });
  
  test('updating a blog post', async () => {
    const updatedBlogData = {
      title: 'Updated Title',
      author: 'Updated Author',
      url: 'https://updated-blog-url.com',
      likes: 99,
    };
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(response.body.title).toBe(updatedBlogData.title);
    expect(response.body.author).toBe(updatedBlogData.author);
    expect(response.body.url).toBe(updatedBlogData.url);
    expect(response.body.likes).toBe(updatedBlogData.likes);
  });
})
  
afterAll(async () => {
  await mongoose.connection.close()
})