const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("Total Likes", () => {
  test("when list is empty, it should return 0", () => {
    const blogs = [];
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(0);
  });

  test("when list has one blog, it should return the likes of that blog", () => {
    const blogs = [
      {
        title: "The first blog in the list",
        author: "Me",
        url: "www.first.com",
        likes: 135,
        id: "65095c59385590a193ed7e63",
      },
    ];
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(135);
  });

  test("when list has multiple blogs, it should return the sum of their likes", () => {
    const blogs = [
      {
        title: "The first blog in the list",
        author: "Me",
        url: "www.first.com",
        likes: 135,
        id: "65095c59385590a193ed7e63",
      },
      {
        title: "The second blog in the list",
        author: "Me",
        url: "www.secondblog.com",
        likes: 5,
        id: "65095cd1385590a193ed7e66",
      },
      {
        title: "The third blog in the list",
        author: "Me",
        url: "www.thirdblog.com",
        likes: 7,
        id: "65095ce0385590a193ed7e68",
      },
      {
        title: "The fourth blog in the list",
        author: "Me",
        url: "www.fourthblog.com",
        likes: 7,
        id: "65098452d36ee7038733f389",
      },
      {
        title: "The fifth blog in the list",
        author: "Me",
        url: "www.fifthblog.com",
        likes: 27,
        id: "650997b791545481a92b6e57",
      },
    ];
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(181);
  });
});


describe('Favorite Blog', () => {
  test('when list is empty, it should return null', () => {
    const blogs = [];
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toBeNull();
  });

  test('when list has one blog, it should return that blog', () => {
    const blogs = [
        {
            title: "The first blog in the list",
            author: "Me",
            url: "www.first.com",
            likes: 135,
            id: "65095c59385590a193ed7e63",
          },
    ];
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual(blogs[0]);
  });

  test('when list has multiple blogs, it should return the favorite (most liked) blog', () => {
    const blogs = [
        {
          title: "The first blog in the list",
          author: "Me",
          url: "www.first.com",
          likes: 135,
          id: "65095c59385590a193ed7e63",
        },
        {
          title: "The second blog in the list",
          author: "Me",
          url: "www.secondblog.com",
          likes: 5,
          id: "65095cd1385590a193ed7e66",
        },
        {
          title: "The third blog in the list",
          author: "Me",
          url: "www.thirdblog.com",
          likes: 7,
          id: "65095ce0385590a193ed7e68",
        },
        {
          title: "The fourth blog in the list",
          author: "NotMe",
          url: "www.fourthblog.com",
          likes: 7,
          id: "65098452d36ee7038733f389",
        },
        {
          title: "The fifth blog in the list",
          author: "NotMe",
          url: "www.fifthblog.com",
          likes: 27,
          id: "650997b791545481a92b6e57",
        },
      ];
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual(blogs[0]); 
  });

});


describe('Most Blogs', () => {
    test('when list is empty, it should return null', () => {
      const blogs = [];
      const result = listHelper.mostBlogs(blogs);
      expect(result).toBeNull();
    });
  
    test('when list has one blog, it should return the author of that blog with 1 blog', () => {
        const blogs = [
            {
              title: "The first blog in the list",
              author: "Me",
              url: "www.first.com",
              likes: 135,
              id: "65095c59385590a193ed7e63",
            }
      ];
      const result = listHelper.mostBlogs(blogs);
      expect(result).toEqual({ author: "Me", blogs: 1 });
    });
  
    test('when list has multiple blogs, it should return the author with the most blogs', () => {
        const blogs = [
            {
              title: "The first blog in the list",
              author: "Me",
              url: "www.first.com",
              likes: 135,
              id: "65095c59385590a193ed7e63",
            },
            {
              title: "The second blog in the list",
              author: "Me",
              url: "www.secondblog.com",
              likes: 5,
              id: "65095cd1385590a193ed7e66",
            },
            {
              title: "The third blog in the list",
              author: "Me",
              url: "www.thirdblog.com",
              likes: 7,
              id: "65095ce0385590a193ed7e68",
            },
            {
              title: "The fourth blog in the list",
              author: "NotMe",
              url: "www.fourthblog.com",
              likes: 7,
              id: "65098452d36ee7038733f389",
            },
            {
              title: "The fifth blog in the list",
              author: "NotMe",
              url: "www.fifthblog.com",
              likes: 27,
              id: "650997b791545481a92b6e57",
            },
          ];
      const result = listHelper.mostBlogs(blogs);
      expect(result).toEqual({ author: "Me", blogs: 3 });
    });
})


describe('Most Likes', () => {
    test('when list is empty, it should return null', () => {
      const blogs = [];
      const result = listHelper.mostLikes(blogs);
      expect(result).toBeNull();
    });
  
    test('when list has one blog, it should return the like that author has with 1 blog', () => {
        const blogs = [
            {
              title: "The first blog in the list",
              author: "Me",
              url: "www.first.com",
              likes: 135,
              id: "65095c59385590a193ed7e63",
            }
      ];
      const result = listHelper.mostLikes(blogs);
      expect(result).toEqual({ author: "Me", likes: 135});
    });
  
    test('when list has multiple blogs, it should return the author with the highest number of likes', () => {
        const blogs = [
            {
              title: "The first blog in the list",
              author: "Me",
              url: "www.first.com",
              likes: 135,
              id: "65095c59385590a193ed7e63",
            },
            {
              title: "The second blog in the list",
              author: "Me",
              url: "www.secondblog.com",
              likes: 5,
              id: "65095cd1385590a193ed7e66",
            },
            {
              title: "The third blog in the list",
              author: "Me",
              url: "www.thirdblog.com",
              likes: 7,
              id: "65095ce0385590a193ed7e68",
            },
            {
              title: "The fourth blog in the list",
              author: "NotMe",
              url: "www.fourthblog.com",
              likes: 7,
              id: "65098452d36ee7038733f389",
            },
            {
              title: "The fifth blog in the list",
              author: "NotMe",
              url: "www.fifthblog.com",
              likes: 27,
              id: "650997b791545481a92b6e57",
            },
          ];
      const result = listHelper.mostLikes(blogs);
      expect(result).toEqual({ author: "Me", likes: 147 });
    });
})