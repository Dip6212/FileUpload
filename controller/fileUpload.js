const File = require("../model/File");
const cloudinary=require("cloudinary").v2;

// localFileUpload handler function->

exports.localFileUpload = async (req, res) => {

    try {

        // fetch files
        const file = req.files.file


        let path = __dirname + "/files" + Date.now() + `.${file.name.split('.')[1]}`;


        file.mv(path,(err)=>{
            console.log(err);
        });

        res.json({
            success:true,
            message:"local file uploaded successfully"
        });

    } catch (error) {

        console.log(error);
    }
}


// image file upload handler

function isFileTypeSupported(type,supportedTypes){
        return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file,folder,quality){
    const option={folder};
    
    if(quality){
        option.quality=quality;
    }
    option.resource_type='auto';
    return await cloudinary.uploader.upload(file.tempFilePath,option);



}

exports.imageUpload= async (req,res)=>{

        try {
            
            // data fetch
            const {name,tags,email}=req.body;
            console.log(name,tags,email);
            const file=req.files.imageFile;
            console.log(file);
            // validation

            const supportedTypes=["jpg","jpeg","png"];
            const fileType=file.name.split('.')[1].toLowerCase();
            console.log(fileType);

            if(!isFileTypeSupported(fileType,supportedTypes)){
                return res.status(400).json({
                    success:false,
                    message:'file format not supported',
                })
            }

            // file format supported

            const response=await uploadFileToCloudinary(file,"DSTAR");
            console.log(response);

            // save entry in databse
            const fileData=await File.create({
                name,
                tags,
                email,
                imageUrl:response.secure_url,
            })


            res.json({
                success:true,
                imageUrl:response.secure_url,
                message:"image successfully uploaded",
            })

        } catch (error) {
            
            console.error(error)
            res.status(400).json({
                success:false,
                message:"something went wrong",
            })
        }
}

exports.videoUpload=async (req,res)=>{

    try {

        const {name,tags,email}=req.body;
        console.log(name,tags,email);
        const file=req.files.videoFile;
        console.log(file);
        const supportedTypes=["mp4","mov"];
        const fileType=file.name.split('.')[1].toLowerCase();
        console.log(fileType);

        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:'file format not supported',
            })
        }

        const response=await uploadFileToCloudinary(file,"DSTAR");
        console.log(response);

        // save entry in databse
        const fileData=await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        })


        res.json({
            success:true,
            videoUrl:response.secure_url,
            message:"video successfully uploaded",
        })

        
    } catch (error) {

        console.error(error)
        res.status(400).json({
            success:false,
            message:"something went wrong",
        })
        
    }
}


exports.imageSizeReducer= async (req,res)=>{

    try {
        
        // data fetch
        const {name,tags,email}=req.body;

        const file=req.files.imageFile;

        // validation

        const supportedTypes=["jpg","jpeg","png"];
        const fileType=file.name.split('.')[1].toLowerCase();

        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:'file format not supported',
            })
        }

        // file format supported

        const response=await uploadFileToCloudinary(file,"DSTAR",30);
        console.log(response);

        // save entry in databse
        const fileData=await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        })


        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:"image successfully uploaded",
        })

    } catch (error) {
        
        console.error(error)
        res.status(400).json({
            success:false,
            message:"something went wrong",
        })
    }
}