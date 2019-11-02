const toArray = require('stream-to-array')

module.exports = {
    convert(stream,callback){
        toArray(stream).then(function (parts){
        const buffers = parts.map(part => Buffer.isBuffer(part) ? part : Buffer.from(part));


        return callback(Buffer.concat(buffers));
        
        })
    },
    record(){
        
    }
}