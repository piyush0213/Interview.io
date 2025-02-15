const jwt = require("jsonwebtoken");
const  User  = require("../models/User.js");
const { ENV_VARS } = require("../config/envVar.js");
const  connectToMongo  = require("../connectDb.js");

const checkUserAuth = async (req, res, next) => {
  await connectToMongo();
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token:",token);
    if (!token) {
      return res.status(401).json({ success: false, message: "Auth Error" });
    }

    const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
    console.log("decoded:",decoded);

    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid Token"});
    }
    console.log("decoded.userId:",decoded.userId);
    const user = await User.findById(decoded.userId).lean().select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    // console.error(error);
    res.status(500).json({ success: false, message: "Invalid Token", error: error });
  }
};

module.exports = checkUserAuth;