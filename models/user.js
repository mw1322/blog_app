import mongoose from "mongoose";
import { createHmac, randomBytes } from "node:crypto";
import { createTokenForUser } from "../services/authentication.js";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profleImageURL: {
      type: String,
      default: "/images/profile.jpg",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    // console.log(user);
    if (!user) throw new Error("Incorrect password");
    const hashedPassword = user.password;
    const salt = user.salt;
    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    if (hashedPassword !== userProvidedHash) {
      throw new Error("Incorrect password");
    }
    // console.log(user);
    const token = await createTokenForUser(user);

    return token;
  }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString();

  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashedPassword;
  console.log("check");
  next();
});

const User = mongoose.model("user", userSchema);
export default User;
