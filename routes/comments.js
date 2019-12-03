const express = require("express");
const router = express.Router();
const { poolPromise } = require("./db");
const sql = require("mssql");

router.route("/:postid").get((req, res) => {
  poolPromise
    .then(pool => {
      return pool
        .request()
        .input("PostID", sql.Int, req.params.postid)
        .query("SELECT * FROM COMMENTS WHERE PostID=@PostID");
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
        .input("CommentID", sql.Int, req.params.id)
        .query("DELETE FROM COMMENTS WHERE CommentID=@CommentID");
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
      return pool
        .request()
        .input("PostID", sql.Int, req.body.PostID)
        .input("CommentDescription", sql.NVarChar, req.body.CommentDescription)
        .input("CommentSong", sql.NVarChar, req.body.CommentSong)
        .input("CommentDate", sql.NVarChar, req.body.CommentDate)
        .input("UserName", sql.NVarChar, req.body.UserName)
        .query(
          `INSERT INTO COMMENTS (PostID, CommentDescription, CommentSong, CommentDate, UserName)
          VALUES
            (@PostID, @CommentDescription, @CommentSong, @CommentDate, @UserName)`
        );
    })
    .then(result => {
      console.log(`${req.body.UserName} posted ${req.body.CommentDescription}`);
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
