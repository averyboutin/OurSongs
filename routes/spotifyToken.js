const express = require("express");
const router = express.Router();
const request = require("request");

router.route("/").get((req, res) => {
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      grant_type: "client_credentials"
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          "018eb308e675406b98d2e64a6bc3072c:4a79b14aa04e46b186764f33c844b30d"
        ).toString("base64")
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    res.send(body);
  });
});

module.exports = router;
