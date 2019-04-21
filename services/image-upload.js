const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

aws.config.update({
    // Should set this as an Env Variable, e.g: process.env.SECRET_ACCESS_KEY
    secretAccessKey: "Iq14XPxKhsKMPX/wLMZdnzbSBwUhZOCx7bg1dcvR",
    // Should set this as an Env Variable, e.g: process.env.ACCESS_KEY_ID
    accessKeyId: "AKIAQP4YHMKTX33ZJ2ZT",
    // Region of the bucket
    region: 'us-east-1' 
});

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'reuser-api',
      acl: 'private',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString() + ".jpeg")
      }
    })
  })
  
module.exports = upload;