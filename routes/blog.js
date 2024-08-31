import { Router } from "express";
import multer from "multer";
import Blog from "../models/blog.js";
const router = Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-blog",(req,res) => {
    return res.render("addBlog", {
        user : req.user
    })
});
router.post("/", upload.single("coverImage"),async(req, res) => {
  const {title,body,coverImage} = req.body;
  try {
    const blog = await Blog.create({
      title,
      body,
      coverImageURL: `uploads/${req.file.filename}`,
      createdBy: req.user._id,
    });
    console.log("data is stored")
  } catch (error) {
    console.log(error);
  }
  return res.redirect(`/blog/${blog._id}`);
});

export default router;