import { asyncHandler } from "../utils/asynchandler.js"
import { ApiError } from "../utils/apierrors.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/clodinary.js";
import verifyJWT from "../"

const generateRefreshTokenAndAccessTokens= async(userId)=>
{
    try {
        const user=await User.findById(userId)
        accessToken=await user.generateAccessToken()
        refreshToken=await user.generateRefreshToken()

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and refresh tokens")
    }
}

const registerUser=asyncHandler( async (req,res) =>{

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
    const avatarLocalPath = req.files && req.files.avatar && req.files.avatar.length > 0 ? req.files.avatar[0].path : null;
    const coverImageLocalPath = req.files && req.files.coverImage && req.files.coverImage.length > 0 ? req.files.coverImage[0].path : null;
    if(avatarLocalPath==null) {throw new ApiError(400,"Avatar needed")}

    //upload them to cloudinary, avatar
    const avatarObject = await uploadOnCloudinary(avatarLocalPath);
    const coverImageObject =await uploadOnCloudinary(coverImageLocalPath);
    if(avatarObject==null) throw new ApiError(400,"Avatar needed")

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

    //return res
    res.status(201).json({createdUser});
} )



const loginUser=asyncHandler( async (req,res) =>{
    //get username/email and password
    const {username,email,password}=req.body
    if(!username||!email) throw new ApiError(400,"username or email are required")

    //check if the user exists
    const user=await User.findOne({
        $or:[{username},{email}]
    })
    if(!user) throw new ApiError(400,"User does not exists")

    //check is the password right
    const isPasswordValid=await user.isPasswordCorrect(password);
    if(!isPasswordValid) throw new ApiError(400,"Incorrect Password")

    //assign the user refresh tokens and access tokens
    const {accessToken,refreshToken}=await generateRefreshTokenAndAccessTokens(user._id)

    //send them in cookies
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .send("User Logged in successfully")

} )

const logoutUser=asyncHandler( async (req,res) =>{
     
} )

export {registerUser,loginUser,logoutUser}

