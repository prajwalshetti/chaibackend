import { asyncHandler } from "../utils/asynchandler.js"
import { ApiError } from "../utils/apierrors.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/clodinary.js"

// const registerUser=asyncHandler( async (req,res)=>{

    //take input from user
    //validation -notempty
    //check if already exist useranam email
    //check for images avatar
    //upload them to cloudinary, avatar
    //create user object update in database
    //remove password and refreshtoken field
    //return res

    // const {username,email,fullname,password}=req.body
    // console.log("email",email)

    // if(fullname===""){throw new ApiError(400,"Fullname is required")}
    // if(username===""){throw new ApiError(400,"username is required")}
    // if(password===""){throw new ApiError(400,"password is required")}
    // if(email===""){throw new ApiError(400,"email is required")}
        
    // const existedUser=await User.findOne({
    //     $or:[{email},{username}]
    // })
    // if(existedUser)throw new ApiError(409,"User already exist")

    // console.log(req.files);

    // const avatarLocalFilePath=await req.files?.avatar[0]?.path
    // const coverImageLocalFilePath=await req.files?.avatar[0]?.path

    // if(!avatarLocalFilePath) throw new ApiError(400,"avatar is required")
    // if(!coverImageLocalFilePath) throw new ApiError(400,"coverImage is required")

    // const avatar=await uploadOnCloudinary(avatarLocalFilePath)
    // const coverImage=await uploadOnCloudinary(coverImageLocalFilePath)

    // if(!avatar)throw new ApiError(411,"cloudinary error")
    // if(!coverImage)throw new ApiError(412,"cloudinary error")

    // const user=User.create({
    //     fullname,
    //     email,
    //     password,
    //     username:username.toLowerCase(),
    //     avatar:avatar.url,
    //     coverImage:coverImage.url||"",
    // })

    // const createdUser=await User.findById(user._id).select(
    //     "-password -refreshTokens"
    // )

    // if(!createdUser) throw new(500,"User creation failed")

    // return res.status(201).json({createdUser})


// })

const registerUser=asyncHandler( async (req,res) =>{

    
    
    
    
    
    
    //return res

    //take input from user (order doesnt matter we just have to match the keys)
    const {email,username,password,fullname}=req.body;

    //validation -notempty (if the below fields are not given we will get an error)
    if(email==null||email===""){throw new ApiError(400,"email is required");}
    if(username==null||username===""){throw new ApiError(400,"username is required");}
    if(password==null||password===""){throw new ApiError(400,"password is required");}

    //check if already exist useranam email
    const existedUser1=await User.findOne({email});
    const existedUser2=await User.findOne({username});
    if(existedUser1||existedUser2){throw new ApiError(400,"User Already exists")};

    //check for images avatar
    const avatarLocalPath=req.files?.avatar[0]?.path
    const coverImageLocalPath=req.files?.coverImage[0]?.path
    // if(!avatarLocalPath) {throw new ApiError(400,"Avatar needed")}

    //upload them to cloudinary, avatar
    const avatarObject=await uploadOnCloudinary(avatarLocalPath)
    const coverImageObject=await uploadOnCloudinary(avatarLocalPath)
    // if(!avatarObject) throw new ApiError(400,"Avatar needed")

    //create user object update in database
    const user=await User.create({
        fullname,
        avatar:avatarObject?.url||"",
        coverImage:coverImageObject?.url||"",
        email,
        password,
        username:username.toLowerCase()
    })

    //remove password and refreshtoken field

    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) throw new ApiError(500,"User creation failed")

    res.status(201).json({createdUser});

 
} )

export {registerUser}




