const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3config = require("../config/aws-s3.config")


const s3 = new aws.S3({
    accessKeyId: s3config.S3_ACCESS_KEY,
    secretAccessKey : s3config.S3_SECRET_ACCESS_KEY,
    region : s3config.S3_BUCKET_REGION
})

const uploadS3 = (bucket_name,folder_name, image_name) => multer({
    storage: multerS3({
      s3,
      bucket: `${bucket_name}/customer_ id ${folder_name}`,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, `${image_name} ${Date.now()}`)
      }
    })
  });


  


module.exports = uploadS3