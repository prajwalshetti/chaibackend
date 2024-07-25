import express from "express"
import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router=express()

router.route("/register").post(registerUser)

export default router