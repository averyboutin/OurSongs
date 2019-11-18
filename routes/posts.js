const express = require("express");
const router = express.Router();
const { poolPromise } = require("./db");

router.route("/").get((req, res) => {
  poolPromise
    .then(pool => {
      return pool.request().query("SELECT * FROM POSTS ORDER BY PostID DESC");
    })
    .then(result => {
      res.json(result.recordset);
    })
    .catch(err => {
      console.log(err);
    });
});

router.route("/:id").get((req, res) => {
  poolPromise
    .then(pool => {
      return pool
        .request()
        .query(`SELECT * FROM POSTS WHERE PostID=${req.params.id}`);
    })
    .then(result => {
      if (result.recordset.length < 1)
        res.status(404).send("there is no post with that id");
      res.json(result.recordset);
    })
    .catch(err => {
      console.log(err);
    });
});

router.route("/page/:numPosts/:pageNumber").get((req, res) => {
  poolPromise
    .then(pool => {
      return pool.request().query(`
        SELECT SUB.PostID, PostDescription, PostSong, SUB.UserID, UserName, COUNT(COMMENTS.PostID) AS numComments
        FROM COMMENTS
        RIGHT JOIN (
          SELECT POSTS.PostID, PostDescription, PostSong, POSTS.UserID, UserName
          FROM POSTS 
            JOIN USERS ON (POSTS.UserID = USERS.UserID)
          ORDER BY PostID DESC
          OFFSET ${req.params.pageNumber * req.params.numPosts} ROWS
          FETCH NEXT ${req.params.numPosts} ROWS ONLY
          ) SUB
          ON COMMENTS.PostID = SUB.PostID
        GROUP BY SUB.PostID, PostDescription, PostSong, SUB.UserID, UserName
            `);
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
        .query(`DELETE FROM POSTS WHERE PostID=${req.params.id}`);
    })
    .then(result => {
      console.log("post deleted!");
      res.json(result.recordset);
    })
    .catch(err => {
      console.log(err);
    });
});

router.route("/").post((req, res) => {
  const post = {
    PostDescription: req.body.PostDescription,
    PostSong: req.body.PostSong,
    UserID: req.body.UserID
  };

  poolPromise
    .then(pool => {
      return pool.request().query(
        `INSERT INTO POSTS (PostDescription, PostSong, UserID)
          VALUES
            ('${post.PostDescription}', '${post.PostSong}', ${post.UserID})`
      );
    })
    .then(result => {
      console.log("post posted!");
      res.send(post);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
