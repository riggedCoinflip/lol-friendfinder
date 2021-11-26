const express = require("express")
const dotenv = require("dotenv")
const multer = require("multer")
const multerS3 = require("multer-s3")
const AmazonS3URI = require("amazon-s3-uri")
const path = require("path")
const {User} = require("../models/user/user")
const aws = require("aws-sdk")
const uuid = require("uuid").v4

const router = express.Router()

dotenv.config()
//S3 avatar image endpoint
aws.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const s3 = new aws.S3({
    apiVersion: "2006-03-01",
})

const maxFileSize = 1024 * 1024 //1MB
const avatarUpload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.S3_BUCKET_NAME,
        acl: "public-read",
        metadata: (req, file, cb) => {
            cb(null, {fieldName: file.fieldname})
        },
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname)
            cb(null, `avatars/${uuid()}${ext}`)
        }
        // TODO resize: https://medium.com/@shamnad.p.s/reduce-image-size-when-uploading-images-to-aws-s3-using-nestjs-and-typescript-e828c347f305
    }),
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase()
        if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
            return cb(new Error("Only images are allowed"))
        }
        cb(null, true)
    },
    limits: {
        fileSize: maxFileSize
    }
})

router.post("/avatar",
    // check if user is authenticated
    (req, res, next) => {
        if (!req?.user.isAuth) {
            res.sendStatus(401)
        } else {
            next()
        }
    },
    avatarUpload.single("avatar"),
    // check if request contains a file
    (req, res, next) => {
        if (!req?.file) {
            res.sendStatus(406)
        } else {
            next()
        }
    },
    // if everything is correct, save URI to image in DB and return it
    async (req, res) => {
        const {location} = req.file
        const user = await User.findOne({_id: req.user._id})

        // if user set an avatar already, delete old avatar image
        if (user.avatar) {
            const uri = user.avatar
            try {
                const {bucket, key} = AmazonS3URI(uri)
                s3.deleteObject({
                    Bucket: bucket,
                    Key: key
                }, err => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Old image deleted successfully")
                    }
                })
            } catch (err) {
                console.warn(`${uri} is not a valid S3 uri`)
            }
        }
        user.avatar = location
        await user.save()

        res.status(200).json({location})
    }
)

module.exports = router