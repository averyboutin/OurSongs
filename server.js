const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const postsRouter = require("./routes/posts");
const spotifyTokenRouter = require("./routes/spotifyToken");
const usersRouter = require("./routes/users");
const commentsRouter = require("./routes/comments");

app.use("/api/posts", postsRouter);
app.use("/api/token", spotifyTokenRouter);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
