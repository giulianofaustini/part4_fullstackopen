const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const usersRouter = require("../controllers/users");
const User = require("../models/user");
const { usersInDb } = require("../tests/test_helper");

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
    const users = await User.findOne({});

    if (!users || users.length === 0) {
      return response
        .status(404)
        .json({ error: "No users found in the database" });
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: users._id,
    });

    const savedBlog = await blog.save();

    users.blogs = users.blogs.concat(savedBlog._id);
    await users.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
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
