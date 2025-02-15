const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { genTokenAndSendCookie } = require("../config/generateToken");
const  connectToMongo  = require("../connectDb.js");
const cloudinary = require("cloudinary");
const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const saveProfileData = async (req, res) => {
  try {
    await connectToMongo();

    const userId = req.user._id;
    const profileData = req.body;

    const user = await User.findByIdAndUpdate(userId, { profileData }, { new: true });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error saving profile data', error });
  }
};

const getProfileData = async (req, res) => {
  try {
    await connectToMongo();

    const userId = req.user._id;

    const user = await User.findById(userId);

    res.status(200).json({ profileData: user.profileData });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile data', error });
  }
};

async function updateAvatar(req, res) {
  try {
    await connectToMongo();

    const userId = req.user._id;
    const file = req.file;
    const user = await User.findById(userId);

    // if the user has an existing avatar, delete it
    if (user.avatar) {
      const publicId = user.avatar.split('/').pop().split('.')[0];
      // console.log("publicId:", publicId);
      await cloudinary.v2.uploader.destroy(`avatar/${publicId}`);
    }

    // upload the new avatar
    cloudinary.v2.uploader.upload(
      file.path,
      {
        folder: "avatar",
        width: 150,
        height: 150,
        crop: "fill",
      },
      async (error, result) => {
        if (error) throw error;
        fs.unlinkSync(file.path);
        await User.findByIdAndUpdate(userId, { avatar: result.secure_url });
        res.status(200).json({
          msg: "Uploaded successfully.",
          url: result.secure_url,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Error updating avatar', error });
  }
};

async function editUser(req, res) {
  try {
    await connectToMongo();
    const { name } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;

    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    // console.log(error.message);
    res.status(501).json({ success: false, message: "Server Error" });
  }
}

async function signup(req, res) {
  try {
    await connectToMongo();
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const exitingUserByEmail = await User.findOne({ email: email }).lean().hint({ email: 1 });

    if (exitingUserByEmail) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User already exists with this email",
        });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be atleast 6 characters",
        });
    }



    const salt = await bcrypt.genSalt(12); // gen salt to hash password, 16 is the number of rounds to generate the salt
    const hashPassword = await bcrypt.hash(password, salt); // hash password
    // 134413 => $2a$10$ewBtosq0qLyCZfpqvY7boeXLdIMB8egJ1UpRovlpW3Dlh4e2ljO8a

    const newUser = new User({
      name, // dont need name: name  just do name
      email,
      password: hashPassword,
      role,
    });
    console.log("newUser:", newUser);

    const token = genTokenAndSendCookie(newUser._id, res);
    console.log("token:", token);
    // test with postman
    await newUser.save();

    res.status(200).json({
      success: true,
      user: {
        ...newUser._doc, // spread operator to get all the properties of the user
        // password: "", // Dont show password
      },
      token: token,
    });
  } catch (error) {
    // console.log(error.message);
    res.status(501).json({ success: false, message: "Server Error" });
  }
}

async function login(req, res) {
  try {
    await connectToMongo();
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    const user = await User.findOne({ email: email }).lean().hint({ email: 1 }); // find user by email
    if (!user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User doesnt not exist with that email",
        });
    }

    const pass = await bcrypt.compare(password, user.password); // compare password
    if (!pass) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }

    const token = genTokenAndSendCookie(user._id, res);

    res.status(200).json({
      success: true,
      user : user,
      // user: {
      //   ...user._doc,
      //   // password: null, // Dont show password
      // },
      message: "User logged in successfully",
      token: token,
    });
  } catch (error) {
    // console.log(error);
    res.status(501).json({ success: false, message: error.message });
  }
}

async function logout(req, res) {

  try {
    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    // console.log(error);
    res.status(501).json({ success: false, message: error.message });
  }
}

// Check user is authenticated or not
async function getAuth(req, res) {
  try {
    // await connectToMongo();
    console.log("req.user:", req.user);
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    // console.log(error.message);
    res.status(501).json({ success: false, message: error.message });
  }
}

module.exports = { signup, login, logout, getAuth, editUser, updateAvatar, saveProfileData, getProfileData };
