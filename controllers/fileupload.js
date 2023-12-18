const File = require("../models/File");
const cloudinary = require("cloudinary").v2;
//local file upload handler function , uploads from client to server 

exports.localFileUpload = async(req,res) => {
    try{
        //fetch file
        const file = req.files.file;
        console.log("FILE RECEIVED -> " , file);

        //where tto store this file
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        console.log("PATH -> " , path);

        file.mv(path , (err)=>{
            console.log(err);
        });

        res.json({
            success : true,
            message : "LOCAL FILE UPLOADD SUCCESSFULLY"
        });

    }catch(err){
        console.log(err);
    }
};

function isFileTypeSupported(type , supportedTypes ){
    return  supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file , folder , quality){
    const options = {folder};

    if(quality){
        options.quality = quality;
    }

    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath , options);
}  

//image upload
exports.imageUpload = async(req,res) => {
    try{
        //data fetch
        const{name , tags , email} = req.body;
        console.log(name,tags,email);

        const file = req.files.image;
        console.log(file);

        //validation
        const supportedTypes = ["jpg" , "jpeg" , "png"];
        const fileType = file.name.split(".")[1].toLowerCase();

        if(!isFileTypeSupported(fileType , supportedTypes))
        {
            return res.status(400).json({
                success : false,
                message : "File type not supported"
            });
        }

        //file format supported now upload to cloudinary
        const response = await uploadFileToCloudinary(file , "FileUpload");
        console.log(response);
        //save entry in db

        const fileData = await File.create({
            name,
            email,
            tags,
            imageUrl : response.secure_url
        })
        
        res.json({
            success : true,
            imageUrl : response.secure_url,
            message : "IMAGE SUCCESSFULLT UPLOADED"
        });

    }catch(err){
        console.error(err);
        res.status(400).json({
            success : false,
            error : err.message,
            message : "SOMETHING WENT WRONG"
        });
    }
}

//video upload

exports.videoUpload = async(req,res) => {
    try{

        //data fetch
        const{name , email , tags} = req.body;
        console.log(name , tags , email);

        const file = req.files.videoFile;
        console.log("THIS IS MY FILE     -> \n" , file);

        //validation
        const supportedTypes = ["mp4" , "mov"];
        const fileType = file.name.split('.')[1].toLowerCase();

        //check if video is not too big upper limit 5Mb
        const fileSize = file.size;
        if(fileSize> 5242880){
            return res.status(400).json({
                success : false,
                message : "File too big"
            });
        }


        if(!isFileTypeSupported(fileType , supportedTypes)){
            return res.status(400).json({
                succes : false,
                message : "File format not supported"
            });
        }

        //FILE FORMAT IS SUPPORTED
        console.log('Uploading to cloudinary');
        const response = await uploadFileToCloudinary(file , "FileUpload");
        console.log(response);

        const fileData = await File.create({
            name ,
            email,
            tags,
            imageUrl : response.secure_url
        })
        
        res.json({
            success : true,
            imageUrl : response.secure_url,
            message : "VIDEO SUCCESSFULLY UPLOADED"
        });

    }catch(err){
        console.log(err);
        res.status(400).json({
            success : false,
            message : "something went wrong",
            error :err.message
        });
    }
}

//imageSizeReducer

exports.imageSizeReducer = async(req , res) => {
    try{

        //data fetch
        const {name , email , tags} = req.body;
        console.log(name , email , tags);
        const file = req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes = ["jpg" , "jpeg" , "png"];
        const fileType = file.name.split(".")[1].toLowerCase();

        if(!isFileTypeSupported(fileType , supportedTypes))
        {
            return res.status(400).json({
                success : false,
                message : "File type not supported"
            });
        }

         //file format supported now upload to cloudinary
         const response = await uploadFileToCloudinary(file , "FileUpload" , 90);
         console.log(response);
         //save entry in db
 
         const fileData = await File.create({
             name,
             email,
             tags,
             imageUrl : response.secure_url
         })
         
         res.json({
             success : true,
             imageUrl : response.secure_url,
             message : "IMAGE SUCCESSFULLT UPLOADED"
         });


    }catch(err){
        console.log(err);
        res.status(400).json({
            success : false,
            message : "Something went wrong",
            error : err.message
        });
    }
}