const {finished} = require('stream');
const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream.js');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end();
        break;
      }

      // Create LimitStream
      const limitStream = new LimitSizeStream({limit: 20048});
      limitStream.on('error', function(err) {
        console.log('Max size of data');
        console.log(writeStream.pending);
        res.statusCode = 413;
        res.end('Max size of data');
      });

      // Create Write Stream
      const writeStream = fs.createWriteStream(filepath, {highWaterMark: 2048});
      writeStream.once('close', function() {
        console.log('WriteFile close');
        if (res.statusCode !== 413) {
          res.statusCode = 201;
          res.end();
        }
      });

      // Pipe
      req.pipe(limitStream).pipe(writeStream);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
