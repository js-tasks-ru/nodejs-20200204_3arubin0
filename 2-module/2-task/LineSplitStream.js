const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.options = options;
    this._chunkStr = '';
  }

  _transform(chunk, encoding, callback) {
    this._chunkStr += chunk.toString(this.options.encoding);
    callback(null);
  }
  _flush(callback) {
    const chunkArr = this._chunkStr.split(os.EOL);
    chunkArr.forEach((item) => {
      this.push(item);
    });
    this._chunkStr = '';
    callback(null);
  }
}
module.exports = LineSplitStream;
