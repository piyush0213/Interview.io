const express = require('express');
const router = express.Router();
const Room = require("../models/Room.js");
const connectToMongo = require("../connectDb.js")

router.post("/addroom/:roomID", async (req, res) => {
    try {
        await connectToMongo();

        const { roomID } = req.params;
        const room = new Room({ roomID });
        const savedRoom = await room.save();
        res.json({success: savedRoom})
    }

    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post("/deleteroom/:roomID", async (req, res) => {
    try {
        await connectToMongo();

        const { roomID } = req.params;
        const room = await Room.deleteMany({ roomID });
        res.json({message: "Room deleted successfully", room});
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.get("/getroom/:roomID", async (req, res) => {
    try {
        await connectToMongo();

        const { roomID } = req.params;
        const room = await Room.findOne({ roomID });
        res.json({message: "Room found", room});
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Save transcription
router.post("/save-transcription/:roomID", async (req, res) => {
  try {
    await connectToMongo();

    const { roomID } = req.params;
    const { transcription } = req.body;

    const room = await Room.findOneAndUpdate(
      { roomID },
      { $push: { transcriptions: transcription } },
      { new: true }
    );

    res.json({ success: true, room });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;