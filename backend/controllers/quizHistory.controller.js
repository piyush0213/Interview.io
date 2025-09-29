import Quiz from "../models/Quiz.js";

export const getUserQuizHistory = async (req, res) => {
  try {
    const userId = req.user.id; // user comes from checkUserAuth middleware
    const history = await Quiz.find({ user: userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching quiz history" });
  }
};
