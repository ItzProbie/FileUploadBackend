const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
require("dotenv").config();

const fileSchema = new mongoose.Schema({
    name:{
        type:String,
        required : true
    },
    imageUrl:{
        type:String
    },
    tags:{
        type:String,
    },
    email:{
        type:String,
        required:true
    }
});

//post middleware
//doc here is the entry records which we will save in our db
fileSchema.post("save" , async function(doc){
    try{
        console.log("DOC : " , doc);

        //transporter
        //SHIFT THIS UNDER CONFIG FOLDER
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user : process.env.MAIL_USER,
                pass : process.env.MAIL_PASS
            }
        });

        //send mail
        let info = await transporter.sendMail({
            from:"Probie17 - By Piyush" , 
            to  : doc.email, 
            subject : "New file uploaded on cloudinary",
           //body of mail
            html : `<h2>Hello User</h2><p>File uploaded</p>View here : <a href="${doc.imageUrl}">${doc.imageUrl}</a>`,
        });

        console.log(info);

    }catch(err){
        console.error(err);

    }
} )


const File = mongoose.model("File" , fileSchema);
module.exports = File;