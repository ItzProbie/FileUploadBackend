//app create
const express = require("express");
const app = express();
const cors = require('cors');

//port from env
require("dotenv").config();
PORT = process.env.PORT || 3000;

//middlewares add krna
app.use(express.json());
app.use(cors());
const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

//db se connect
const db = require("./config/database");
db.dbconnect();

//clodinary se connect
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

//api route mounting
const Upload = require("./routes/FileUpload.js");
app.use("/api/v1/upload" , Upload);

//activate server
app.listen(PORT , () => {
    console.log(`APP has started at PORT number ${PORT}`);
})
