
const Blog = require("../models/blog")
const User = require('../models/user')

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
    console.log(blogs);
    return blogs.map(blog => blog.toJSON())   
  }
  
  const usersInDb = async() => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }
  
  module.exports = {
    initialBlogs, blogsInDb, usersInDb
  }