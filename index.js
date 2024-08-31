import path from "path";
import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/index.js";
import cookieParser from "cookie-parser";
import checkForAuthenticationCookie from "./middlewares/authentication.js";
dotenv.config({
    path : "./.env"
});
connectDb();
const app = express();
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
// app.get("/", (req, res) => {
//   return res.json({
//     message : "nice"
//   });
// });
app.get("/", async (req,res) => {
    const blogs = await Blog.find();
     res.render("home",{
        user : req.user,
        blogs: blogs
    });
})


//Routes : 
import userRoute from "./routes/user.js";
import blogRoute from "./routes/blog.js";
import Blog from "./models/blog.js";

app.use("/user",userRoute);
app.use("/blog", blogRoute);


app.listen(process.env.PORT,() => console.log(`Server started at PORT:${process.env.PORT}`));
