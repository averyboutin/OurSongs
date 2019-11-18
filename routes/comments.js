const express = require("express");
const router = express.Router();
const { poolPromise } = require("./db");

router.route("/:postid").get((req, res) => {
  poolPromise
    .then(pool => {
      return pool.request().query(`
        SELECT CommentID, PostID, CommentDescription, CommentSong, COMMENTS.UserID, UserName 
        FROM COMMENTS
          JOIN USERS ON (COMMENTS.UserID = USERS.UserID) 
        WHERE PostID=${req.params.postid}`);
    })
    .then(result => {
      res.json(result.recordset);
    })
    .catch(err => {
      console.log(err);
    });
});

router.route("/:id").delete((req, res) => {
  poolPromise
    .then(pool => {
      return pool
        .request()
        .query(`DELETE FROM COMMENTS WHERE CommentID=${req.params.id}`);
    })
    .then(result => {
      console.log("comment deleted!");
      res.json(result.recordset);
    })
    .catch(err => {
      console.log(err);
    });
});

router.route("/").post((req, res) => {
  const comment = {
    PostID: req.body.PostID,
    CommentDescription: req.body.CommentDescription,
    CommentSong: req.body.CommentSong,
    UserID: req.body.UserID
  };

  poolPromise
    .then(pool => {
      return pool.request().query(
        `INSERT INTO COMMENTS (PostID, CommentDescription, CommentSong, UserID)
          VALUES
            (${comment.PostID}, '${comment.CommentDescription}', '${comment.CommentSong}', ${comment.UserID})`
      );
    })
    .then(result => {
      console.log("comment posted!");
      res.send(comment);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
