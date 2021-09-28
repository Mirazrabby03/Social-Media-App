const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");

dotenv.config();
//database connection
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.5z7fm.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(() =>{
    console.log(`connection successful to database`);
}).catch((e) =>{
    console.log(`no connection`);
})
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(cors());


//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));



const storage = multer.diskStorage({   
    destination: (req, file,cb) =>{
        cb(null, "public/images");
    },
    filename: (req,file,cb)=>{
        cb(null, req.body.name);
    },   
});

const upload = multer({storage: storage});
app.post("/api/upload", upload.single("file"),(req,res)=>{
    try{
        return res.status(200).json("File uploaded successfully")
    }catch(err){
        console.log(err);  
    }
})   

//route
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

const port = process.env.PORT || 8000;
app.listen(port, ()=>{
    console.log(`app is listening to port no ${port}`)
})