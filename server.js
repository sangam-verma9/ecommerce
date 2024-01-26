const express =require("express")
const app = require("./app");
const connectdb = require("./database/db");
const cloudinary =require ("cloudinary")

//add environment variable
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const path =require("path")

//uncaught error ** such as you type console.log(sangam) but sangam not defied 
//so we want to close server at upper so here we define upper
process.on("uncaughtException", (err) => {
  console.log(`Error:${err.message}`);
  console.log("sutting down the server due to unhandled promice rejection");
  process.exit(1);
});

//connect database
connectdb();

//add cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get("/",(req,res)=>{
  app.use(express.static(path.resolve(__dirname,"frontend","build")));
  res.sendFile(path.resolve(__dirname,"frontend","build","index.html"));
})

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`server is listening at port no ${PORT}...`);
  //   console.log(`server is listening at port no 5000...`);
});

//unhandled promice rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error:${err.message}`);
  console.log("sutting down the server due to unhandled promice rejection");
  server.close(() => {
    process.exit(1);
  });
});
