const toArray = require("stream-to-array");
const GIFEncoder = require("gifencoder");

module.exports = {
  convert: function convert(stream, callback) {
    // call stream to array
    toArray(stream).then(function(parts) {
      // add all the parts togetter
      const buffers = parts.map(part =>
        Buffer.isBuffer(part) ? part : Buffer.from(part)
      );
      // concat then and send them up
      return callback(Buffer.concat(buffers));
    });
  },
  // handels recording
  Record: class Record {
    constructor() {
      this.encoder = null;
      this.stream = null;
    }
    // creates a encoder
    makeGifEncoder(width, height) {
      this.encoder = new GIFEncoder(width, height);
      // put the output in this stream
      this.stream = this.encoder.createReadStream();

      // settings
      this.encoder.start();
      this.encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
      this.encoder.setDelay(42); // frame delay in ms
      this.encoder.setQuality(10); // image quality. 10 is default.
    }
    addFrame(context) {
      // add a frame form canvas
      this.encoder.addFrame(context);
    }
    finish(callback) {
      // encoder is done
      this.encoder.finish();
      // convert the stream in a buffer for upload
      module.exports.convert(this.stream, buffer => {
        // give back the buffer
        return callback(buffer);
      });
    }
  },
  calulations: {
    norm(value, min, max) {
      return (value - min) / (max - min);
    },
    lerp(norm, min, max) {
      return (max - min) * norm + min;
    },
    map(value, sourceMin, sourceMax, destMin, destMax) {
      return this.lerp(this.norm(value, sourceMin, sourceMax),destMin,destMax);
    }
  }
};
