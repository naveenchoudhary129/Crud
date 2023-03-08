require("dotenv").config({path:"./config/.env"});
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const app = express();


//middlewares
app.use(express.json());
app.use(morgan("tiny"));

//routes

app.use("/api" , require("./routes/register"));
app.use("/api" , require("./routes/login"));

//server config

const PORT = process.env.PORT  || 8000

app.listen(PORT , async() =>{ 
    try {
        await connectDB();
        console.log(`Server listening on port : ${PORT}`)    
    } catch (error) {
        console.log(error);
    }
    
})