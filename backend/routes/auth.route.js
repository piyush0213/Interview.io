// import express from "express";
// import { signup, login, logout, getAuth } from "../controllers/auth.controller.js";
// import { checkUserAuth } from "../middleware/checkUserAuth.js";
const express = require("express");
const { signup, login, logout, getAuth, editUser, updateAvatar, saveProfileData, getProfileData } = require("../controllers/auth.controller.js");
const checkUserAuth = require("../middleware/checkUserAuth.js");
const checkFileType = require("../middleware/checkFileType.js");
const uploadFile = require("../middleware/uploadFile.js");
const uploadResume = require("../middleware/uploadResume.js");

const router = express.Router();
    
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/editUser", checkUserAuth, editUser);
router.post("/updateAvatar", checkUserAuth, uploadFile, checkFileType, updateAvatar);
router.post('/saveProfileData', checkUserAuth, saveProfileData);
router.get('/getProfileData', checkUserAuth, getProfileData);
router.post('/uploadResume', checkUserAuth, uploadResume, uploadResume);

router.get("/getAuth", checkUserAuth, getAuth);

module.exports = router;
