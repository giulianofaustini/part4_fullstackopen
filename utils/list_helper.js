const blog = require("../models/blog");

const dummy = (blogs) => {
    
    return 1;
  };

  const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }

  const favoriteBlog = (blogs) => {
   if (blogs.length === 0) {
    return null
   }
    let favorite = blogs[0]
    for (const blog of blogs) {
        if(blog.likes > favorite.likes)
        favorite = blog
    }
    return favorite
  }

  const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    const authorCount =  {}
    
    for (const blog of blogs) {
        if(authorCount[blog.author]) {
            authorCount[blog.author] ++
        } else {
        authorCount[blog.author] = 1
    }
  }
let topAuthor = null
let maxBlogs = 0

for (const author in authorCount)
if (authorCount[author] > maxBlogs) {
 topAuthor = author
 maxBlogs = authorCount[author]
}

return {
    author: topAuthor,
    blogs: maxBlogs,
  };
};
  

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
      return null;
    }
  
    const authorLikes = {};
  
    for (const blog of blogs) {
      if (authorLikes[blog.author]) {
        authorLikes[blog.author] += blog.likes;
      } else {
        authorLikes[blog.author] = blog.likes;
      }
    }

    let topAuthor = null;
    let maxLikes = 0;
  
    for (const author in authorLikes) {
      if (authorLikes[author] > maxLikes) {
        topAuthor = author;
        maxLikes = authorLikes[author];
      }
    }

    return {
      author: topAuthor,
      likes: maxLikes,
    };
  };
  
 

  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  };
