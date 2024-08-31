import { Router } from "express";
import User from "../models/user.js";
import { createTokenForUser } from "../services/authentication.js";

const route = Router();

route.get("/signin", (req, res) => {
  return res.render("signin.ejs");
});

route.get("/signup", (req, res) => {
  return res.render("signup");
});

route.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email + password);
    const token = await User.matchPasswordAndGenerateToken(email, password);
    // console.log("token", token);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
     return res.render("signin",{
      error : "incorrect email or password",
     });
  }

  

  // console.log("User logged in ",user);
});

route.get("/logout",(req,res) => {
  return res.clearCookie("token").redirect("/");
})

route.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  // console.log(req.body);
  if ([fullName, email, password].some((item) => !item)) {
    return res.status(400).json({
      err: "field is empty",
    });
  }
  const user = User.create({
    userName: fullName,
    email,
    password,
  });
  if (!user) {
    res.status(400).json({
      err: "User is not credited",
    });
  }
  res.json({
    message: "done",
  });
});

export default route;
