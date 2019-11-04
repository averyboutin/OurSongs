const http = require('http');
const fs = require('fs');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(response);

function response(req, res) {
    let file = "";
    if (req.url == "/") {
        file = __dirname + "/index.html";
    } else {
        file = __dirname + req.url;
    }

    fs.readFile(file, function (err, page) {
        if (err) {
            res.writeHead(404);
            return res.end("Page not found!");
        }
        res.writeHead(200);
        res.end(page);
    });
}

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});