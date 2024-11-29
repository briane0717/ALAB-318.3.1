// routes/posts.js
const express = require("express");
const router = express.Router();
const posts = require("../data/posts");
const error = require("../utilities/error");

// Existing routes...

// GET /api/posts
router.get("/", (req, res) => {
  const { userId } = req.query;

  if (userId) {
    const userPosts = posts.filter((post) => post.userId == userId);
    res.json(userPosts);
  } else {
    res.json(posts);
  }
});

// GET /api/users/:id/posts - Retrieves all posts by a user
router.get("/users/:id/posts", (req, res) => {
  const userPosts = posts.filter((post) => post.userId == req.params.id);
  res.json(userPosts);
});

// GET /api/posts/:id - Retrieves a specific post by id
router.get("/:id", (req, res, next) => {
  const post = posts.find((p) => p.id == req.params.id);
  const links = [
    {
      href: `/${req.params.id}`,
      rel: "",
      type: "PATCH",
    },
    {
      href: `/${req.params.id}`,
      rel: "",
      type: "DELETE",
    },
  ];

  if (post) res.json({ post, links });
  else next();
});

// PATCH /api/posts/:id - Updates a post
router.patch("/:id", (req, res, next) => {
  const post = posts.find((p, i) => {
    if (p.id == req.params.id) {
      for (const key in req.body) {
        posts[i][key] = req.body[key];
      }
      return true;
    }
  });

  if (post) res.json(post);
  else next();
});

// DELETE /api/posts/:id - Deletes a post
router.delete("/:id", (req, res, next) => {
  const post = posts.find((p, i) => {
    if (p.id == req.params.id) {
      posts.splice(i, 1);
      return true;
    }
  });

  if (post) res.json(post);
  else next();
});

module.exports = router;
