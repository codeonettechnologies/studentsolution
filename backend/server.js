const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./config/database");
const app =  express()
dotenv.config();

const PORT = process.env.PORT || 5000
connectDB();
app.get("/hello",(req , res)=>{
    res.send("hello guys ")
    
})

app.listen(PORT , ()=>{
    console.log(`server running at port number ${PORT}`);
    
})