const express = require("express");

const app = express();

app.use("/",(req,res)=>{
    res.send("Hello Devs!")
});

app.use("/test",(req,res)=>{
    res.send("Hello from test!")
});

app.use("/dashboard",(req,res)=>{
    res.send("Hello from dashboard!")
});

app.listen(7777, ()=>{console.log("Server is succesfully connected to port 7777.....");});