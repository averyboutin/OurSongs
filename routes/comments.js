const express = require("express");
const router = express.Router();
const { poolPromise } = require("./db");

router.route("/:postid").get((req, res) => {
  poolPromise
    .then(pool => {
      return pool.request().query(`
        SELECT CommentID, PostID, CommentDescription, CommentSong, CommentDate, UserName, IsInPlaylist
        FROM COMMENTS 
        WHERE PostID=${req.params.postid}`);
    })
    .then(result => {
      console.log("comments fetched!");
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
  poolPromise
    .then(pool => {
      return pool.request().query(
        `INSERT INTO COMMENTS (PostID, CommentDescription, CommentSong, CommentDate, UserName)
          VALUES
            (${req.body.PostID}, '${req.body.CommentDescription}', '${req.body.CommentSong}', '${req.body.CommentDate}', '${req.body.UserName}')`
      );
    })
    .then(result => {
      console.log("comment posted!");
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

router.route("/").put((req, res) => {
  poolPromise
    .then(pool => {
      return pool.request().query(
        `UPDATE COMMENTS
        SET IsInPlaylist = '${req.body.value}'
        WHERE CommentID = ${req.body.CommentID}`
      );
    })
    .then(result => {
      console.log("comment updated!");
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
