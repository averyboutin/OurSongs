const express = require("express");
const router = express.Router();
const { poolPromise } = require("./db");

router.route("/").get((req, res) => {
  poolPromise
    .then(pool => {
      return pool.request().query("SELECT * FROM POSTS ORDER BY PostDate DESC");
    })
    .then(result => {
      res.json(result.recordset);
    })
    .catch(err => {
      console.log(err);
    });
});

router.route("/count").get((req, res) => {
  poolPromise
    .then(pool => {
      return pool.request().query("SELECT COUNT(*) AS Count FROM POSTS");
    })
    .then(result => {
      res.json(result.recordset[0]);
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
        SELECT PostID, PostDescription, PostSong, PostDate, UserName, Playlist, (SELECT COUNT(*) FROM COMMENTS WHERE COMMENTS.PostID = POSTS.PostID) as numComments
        FROM POSTS 
        ORDER BY PostDate DESC
        OFFSET ${req.params.pageNumber * req.params.numPosts} ROWS
        FETCH NEXT ${req.params.numPosts} ROWS ONLY
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
  poolPromise
    .then(pool => {
      return pool.request().query(
        `INSERT INTO POSTS (PostDescription, PostSong, PostDate, UserName, Playlist)
          VALUES
            ('${req.body.PostDescription}', '${req.body.PostSong}', '${req.body.PostDate}', '${req.body.UserName}', '${req.body.Playlist}')`
      );
    })
    .then(result => {
      console.log("post posted!");
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
