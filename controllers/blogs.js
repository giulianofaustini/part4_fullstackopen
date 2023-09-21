const blogsRouter = require("express").Router();
const Blog = require("../models/blog");


blogsRouter.get("/", async(request, response) => {
  try {
    const blog = await Blog.find({}).then((blogs) => {
      response.json(blogs);
    });
  } catch (error) {
    next(error)
  }
});


blogsRouter.post("/", async (request, response, next) => {
  const { body } = request;
  console.log("Received POST request with body:", body);
  if (!body.likes) {
    body.likes = 0;
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });
  try {
    const savedBlog = await blog.save()
  response.status(201).json(savedBlog);
  } catch (error) {
    next(error)
  }
});


blogsRouter.delete("/:id", async(request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end();
  } catch (error) {
    next(error)
  }
});


blogsRouter.get("/:id", async(request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
      console.error("Error fetching person by ID. Insert the right ID number.");
    }
  } catch (error) {
      next(error)
  }
});


blogsRouter.put("/:id", async(request, response, next) => {
  const { body } = request;
  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };
  try {
   const updatedBlogDoc = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
    if (updatedBlogDoc) {
      response.json(updatedBlogDoc);
    } else {
      response.status(404).json({ error: "Blog not found" });
    }
  } catch(error) {
    next(error)
  }
});

module.exports = blogsRouter;

