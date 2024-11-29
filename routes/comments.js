const express = require("express");
const router = express.Router();
const comments = require("../data/comments");
const error = require("../utilities/error");

// GET /api/comments - Retrieves all comments, with optional filtering by userId and postId
router
  .route("/")
  .get((req, res) => {
    let filteredComments = comments;

    // Filter by userId if provided
    if (req.query.userId) {
      filteredComments = filteredComments.filter(
        (comment) => comment.userId == req.query.userId
      );
    }

    // Filter by postId if provided
    if (req.query.postId) {
      filteredComments = filteredComments.filter(
        (comment) => comment.postId == req.query.postId
      );
    }

    res.json(filteredComments); // Return filtered comments
  })

  .post((req, res, next) => {
    const { userId, postId, body } = req.body;

    if (userId && postId && body) {
      const newComment = {
        id: comments[comments.length - 1].id + 1,
        userId,
        postId,
        body,
      };

      comments.push(newComment);
      res.json(newComment);
    } else {
      next(error(400, "No Comment"));
    }
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const comment = comments.find((c) => c.id == req.params.id);

    if (comment) {
      res.json(comment);
    } else {
      next();
    }
  })
  .patch((req, res, next) => {
    const comment = comments.find((c, i) => {
      if (c.id == req.params.id) {
        comments[i].body = req.body.body || comments[i].body;
        return true;
      }
    });

    if (comment) {
      res.json(comment);
    } else {
      next();
    }
  })
  .delete((req, res, next) => {
    const index = comments.findIndex((c) => c.id == req.params.id);

    if (index !== -1) {
      const deletedComment = comments.splice(index, 1);
      res.json(deletedComment);
    } else {
      next();
    }
  });

module.exports = router;
