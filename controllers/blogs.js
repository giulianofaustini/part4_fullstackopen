const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const usersRouter = require("../controllers/users");
const User = require("../models/user");
const { usersInDb } = require("../tests/test_helper");
const jwt = require('jsonwebtoken')

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

blogsRouter.get("/", async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }


blogsRouter.post("/", async (request, response, next) => {
  const { body } = request;
  console.log("Received POST request with body:", body);
  if (!body.title || !body.url) {
    return response.status(400).json({ error: "Title and URL are required" });
  }
  if (!body.likes) {
    body.likes = 0;
  }
  try {
    // const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    if (!user || user.length === 0) {
      return response
        .status(404)
        .json({ error: "No users found in the database" });
    }
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    console.log("Received user with token:", decodedToken);
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id,
    });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: "Blog not found" });
    }
    if(blog.user.toString() !== decodedToken.id) {
      return response.status(403).json({ error: "Permission denied" });
    }
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
      console.error("Error fetching person by ID. Insert the right ID number.");
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const { body } = request;
  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };
  try {
    const updatedBlogDoc = await Blog.findByIdAndUpdate(
      request.params.id,
      updatedBlog,
      { new: true }
    );
    if (updatedBlogDoc) {
      response.json(updatedBlogDoc);
    } else {
      response.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;

