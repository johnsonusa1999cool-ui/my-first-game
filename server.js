const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 8000;
const publicDir = __dirname;

const contentTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const server = http.createServer((req, res) => {
  const safePath = req.url === "/" ? "/index.html" : req.url;
  const filePath = path.join(publicDir, safePath);

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }

    const extension = path.extname(filePath);
    const contentType = contentTypes[extension] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
