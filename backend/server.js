const assert = require("assert")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const createApollo = require("./src/utils/createApolloServer")
const expressApp = require("./src/utils/createExpressApp")
const aws = require("aws-sdk")
const AmazonS3URI = require('amazon-s3-uri')
const multer = require("multer")
const multerS3 = require("multer-s3")
const uuid = require("uuid").v4
const path = require("path")
const {User} = require("./src/models/user/user");

// allow use of dotenv
dotenv.config()
//check if env variables set
assert(process.env.NODE_ENV, "Specify NODE_ENV")
const NODE_ENV_ALLOWED = ["production", "development", "test"]
if (!NODE_ENV_ALLOWED.includes(process.env.NODE_ENV)) throw new Error(`NODE_ENV "${process.env.NODE_ENV}" has to be in: ${NODE_ENV_ALLOWED}`)
assert(process.env.ATLAS_URI, "No MongoDB Atlas URI specified")
assert(process.env.JWT_SECRET, "Set this to ANY String (for development)")


// Connect MongoDB
const ATLAS_URI = process.env.ATLAS_URI;

mongoose
    .connect(ATLAS_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(async () => {
        console.log("Connection to DB successful");

        if (process.env.NODE_ENV === "development") {
            //create data for db
            const createMongoData = require("./src/utils/createMongoData");
            await createMongoData()
        }
    })
    .catch(err => {
        console.log(`Connection to DB Error: ${err}`);
    });

//express
const app = expressApp;

//apollo
const apollo = createApollo()

//S3 avatar image endpoint
aws.config.update({
    region: "eu-central-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const s3 = new aws.S3({
    apiVersion: "2006-03-01",
})

const bucket = process.env.S3_BUCKET_NAME

const maxFileSize = 1024 * 1024 //1MB
const avatarUpload = multer({
    storage: multerS3({
        s3,
        bucket,
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
        const ext = path.extname(file.originalname);
        if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
            return cb(new Error("Only images are allowed"))
        }
        cb(null, true)
    },
    limits: {
        fileSize: maxFileSize
    }
})


app.post("/upload/avatar",
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

//launch
const PORT = process.env.PORT || 5000;
app.listen({port: PORT}, () => {
    console.log(`🚀 Apollo Server ready on http://localhost:${PORT}${apollo.graphqlPath}`);
});

