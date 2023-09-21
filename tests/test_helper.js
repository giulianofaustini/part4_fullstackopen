
const Blog = require("../models/blog")

const initialBlogs = [
    {
      title: 'The first thest blog.',
      author: 'Not me',
      url: 'www.firstTestBlog.com',
      like: '23',
    },
    {
      title: 'The Second Test Blog EFFF',
      author: 'not me',
      url: 'www.testthis.com',
      likes: 45,
    }
  ]

  const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }
  
  module.exports = {
    initialBlogs, blogsInDb
  }