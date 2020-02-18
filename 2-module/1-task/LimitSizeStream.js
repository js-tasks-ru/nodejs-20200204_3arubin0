const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.totalSize = 0;
    this.options = options;
  }

  _transform(chunk, encoding, callback) {
    this.totalSize += chunk.length;
    if (this.totalSize <= this.options.limit ) {
      this.push(chunk.toString(this.options.encoding));
      callback(null);
    } else {
      callback(new LimitExceededError());
    }
    // callback(null, ((chunk) => {
    //   this.totalSize += chunk.length;
    //   return this.totalSize.toString();
    // })(chunk));
  }
}
// let limitStream = new LimitSizeStream({limit: 3, encoding: 'utf-8'});
// limitStream.on('data', (chunk) => {
//   console.log(chunk);
// });
//
// limitStream.write('a');
// limitStream.write('b');
//
// limitStream = new LimitSizeStream({limit: 1, encoding: 'utf-8'});
// limitStream.on('data', (chunk) => {
//   console.log(chunk);
// });
//
// limitStream.on('error', (err) => {
//   console.log('err');
// });
//
// limitStream.write('a');
// limitStream.write('a');
module.exports = LimitSizeStream;
