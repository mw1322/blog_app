import JWT from "jsonwebtoken";
const secret = "SuperMan123";
function createTokenForUser(user){
    const payload = {
      _id: user._id,
      email: user.email,
      userName : user.userName,
      profileImageURL: user.profleImageURL,
      role: user.role,
    };
    // console.log(user.profileImageURL, user.email);
    const token = JWT.sign(payload,secret);
    return token;
}
function validateToken(token){
    const payload = JWT.verify(token,secret);
    return payload;
}
export {createTokenForUser,validateToken};
