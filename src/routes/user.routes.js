import express from "express"
import { Router } from "express";
import { registerUser,loginUser,logoutUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=express()

router.route("/register").post(

    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),

    registerUser
)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyjwt,logoutUser)


export default router