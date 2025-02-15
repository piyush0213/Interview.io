const express = require('express');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { ENV_VARS } = require('../config/envVar.js');
const Quiz = require('../models/Quiz.js');
const connectToMongo = require('../connectDb.js');

const router = express.Router();
    
router.post('/generate-id', async (req, res) => {
    await connectToMongo();

    const  { userID, qty }  = req.body;
    console.log("userID:", userID);
    console.log("qty:", qty);
    const newQuiz = new Quiz({
        userID,
        qty,
    });
    await newQuiz.save();
    const quizID = newQuiz._id;

    console.log("quizID:", quizID);
    res.json({ quizID: quizID });
});

router.post('/generate-quiz', async (req, res) => {
    const { techstack, difficulty, userID, quizID, qsNo, qty } = req.body;
    let actualDifficulty = difficulty;
    if (!difficulty) {
        actualDifficulty = "random";
    }
    console.log("qsNo:", qsNo);
    console.log("qty:", (qty));
    if ((qsNo) > qty) {
        console.log("No more questions");
        return res.json({ hasMoreQuestions: false });
    }
``

    const genAI = new GoogleGenerativeAI(ENV_VARS.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a Interview Quiz Question Generator. Generate 1 MCQ interview questions(give code snippets if necessary for the question asked) with answers for topic: ${techstack} in ${actualDifficulty} level difficulty. 
    give your response in json format as follows:
    question:
    (if giving output-based/code-based question use this for the code)code_snippet:
    options(minimum 3 or 4 options):[]
    correct:
    correctIndex:

    Do not exceed the number of questions (1) and do not include the letters in the options. Just include the actual options.
    Do not repeat options keep it distinct and unique.
    
    correctIndex is the index of the correct answer in the options array. For example, if the correct answer is the first option, then correctIndex is 0. If the correct answer is the second option, then correctIndex is 1 and so on.

    If you are giving a code snippet in the question, then then only include the code in code_snippet field and dont include the code in the question field. If you are giving a code snippet as an option then change the name of the options:[] field to options_code:[] and include the options in it.

    Example for the question: What is the output of the following C code? c int main() { int a = 5; int *ptr = &a; int **ptrptr = &ptr; printf("%d", **ptrptr); return 0; }

    only include What is the output of the following C code? in question field and the rest: c int main() { int a = 5; int *ptr = &a; int **ptrptr = &ptr; printf("%d", **ptrptr); return 0; } in code_snippet field.

    this doesnt mean only include output questions, you can include fill in the code or a variety of questions.

    Avoid this error: Error generating questions: SyntaxError: Expected ',' or ']' after array element in JSON



    `
    // Below are user's custom input:
    // - GIVE CODE SNIPPET QUESTIONS ONLY ON THE DIFFICULTY SPECIFIED
    // `
    console.log(prompt);
    try {
        await connectToMongo();

        const results = await model.generateContent(prompt);
        console.log(results.response.text())
        const generatedQuestion = JSON.parse(results.response.text().replace(/```json|```/g, '').trim());
        console.log(generatedQuestion);

        const quiz = await Quiz.findById(quizID);
        console.log("quiz:", quiz);
        quiz.questions.push(generatedQuestion);
        quiz.correct_answers.push(generatedQuestion.correct);
        quiz.correct_answers_index.push(generatedQuestion.correctIndex);
        await quiz.save();
        delete generatedQuestion.correct;
        delete generatedQuestion.correctIndex;

        res.json({ question: generatedQuestion, techstack, difficulty });
    } catch (error) {
        console.error('Error generating questions:', error);
        res.status(500).json({ error: 'Failed to generate questions' });
    }
});

router.post('/save-answer', async (req, res) => {
    await connectToMongo();

    const { selectedAnswer, selectedIndex, quizID } = req.body;
    console.log("selectedAnswer:", selectedAnswer);
    console.log("selectedIndex:", selectedIndex);
    console.log("quizID:", quizID);
    try {
        const quiz = await Quiz.findById(quizID);
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        quiz.chosen_answers.push(selectedAnswer);
        quiz.chosen_answers_index.push(selectedIndex);

        await quiz.save();
        res.json({ message: 'Answer submitted successfully' });
    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).json({ error: 'Failed to submit answer' });
    }
});

router.post('/evaluate-answer', async (req, res) => {
    await connectToMongo();

    const { userID, quizID } = req.body;
    const quiz = await Quiz.findById(quizID);
    const correctAnswers = quiz.correct_answers_index;
    const userAnswers = quiz.chosen_answers_index;
    const score = correctAnswers.filter((answer, index) => answer === userAnswers[index]).length;       
    console.log("score:", score);
    quiz.score = score;
    quiz.status = 'Completed';
    await quiz.save();
    console.log("quiz:", quiz);
    res.json({ quiz });
});

router.post('/terminate-quiz', async (req, res) => {
    await connectToMongo();

    const { quizID } = req.body;
    await Quiz.findByIdAndDelete(quizID);
    res.json({ message: 'Quiz terminated successfully' });
});

module.exports = router;