// require('dotenv').config({path:"./env"})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path:"./env"
})


connectDB().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`App is listening on port ${process.env.PORT}`)
    })
})

/*
import express from "express"
const app=express()
;( async ()=>{
    try{
        await mongoose.connect(`${process.env.mMONGODB_URI}/${dbname}`)

        app.on("error",()=>{
            console.log(error)
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.PORT}`)
        })


    }catch(error){
        console.eroor(error)
        throw err
    }
})()
*/