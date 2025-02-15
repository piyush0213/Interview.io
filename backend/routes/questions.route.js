const express = require('express');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { ENV_VARS } = require('../config/envVar.js');
const router = express.Router();

router.post('/chat', async (req, res) => {
    // the prompt is being sent like {"message":"hi"}
    const { message } = req.body;
    console.log("user prompt: "+message);
    
    const genAI = new GoogleGenerativeAI(ENV_VARS.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

    // const prompt = `You are a chatbot. Reply to this: ${message}`;
    
    try {
        const results = await model.generateContent(message);
        const reply = results.response.text();
        console.log("bot reply: "+reply);   
        res.json({ reply });
    } catch (error) {
        console.error('Error generating reply:', error);
        res.status(500).json({ error: 'Failed to generate reply' });
    }
});


router.post('/generate-questions', async (req, res) => {
    const { techstack, qty, difficulty, id } = req.body;
    const genAI = new GoogleGenerativeAI(ENV_VARS.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    let actualDifficulty = difficulty;
    if(!qty){
        res.status(400).json({ error: 'Quantity of questions is required' });
    }
    if (!difficulty) {
        actualDifficulty = "random";
    }

    const prompt = `Generate ${qty} interview questions (with answers) for topic: ${techstack} in ${actualDifficulty} level difficulty.`;

    console.log(prompt);
    try {
        const results = await model.generateContent(prompt);
        const generatedQuestions = results.response.text().replace("```", "").trim();
        // const questions = generatedQuestions.split("\n\n");
        console.log(results.response.text())
        // console.log(generatedQuestions)
        // console.log(questions)
        res.json({ questions: results.response.text() });
    } catch (error) {
        console.error('Error generating questions:', error);
        res.status(500).json({ error: 'Failed to generate questions' });
        }
    });


module.exports = router;
// router.post('/generate-question', async (req, res) => {
//     const { techstack, difficulty, currentQuestion } = req.body;

//     const prompt = `Give 1 interview quiz question on the techstack ${techstack} of ${difficulty} difficulty with options and divide the question after the options as END OF QS-${currentQuestion}. Then give the answer to the question under the heading Answer.`;
//     console.log(prompt);
//     try {
//         const results = await model.generateContent(prompt);
//         const generatedContent = results.response.text();
//         console.log("generated content:",generatedContent);
//         // Extract question and answer
//         const [questionPart, answerPart] = generatedContent.split('Answer');
//         console.log("questionPart:",questionPart);
//         console.log("answerPart:",answerPart);
//         const questionBlock = questionPart.split('**END OF QS-')[0].trim();
//         console.log("questionBlock:",questionBlock);
//         const [question, ...options] = questionBlock.split('\n').filter(line => line.trim());
//         console.log("question:",question);
//         console.log("options:",options);
//         const answer = answerPart.trim().replace(/^\*\*\d+\.\s*/, '').trim();
//         console.log("answer:",answer);
//         res.json({
//             question: question.replace(/^\*\*\d+\.\s*/, '').trim(),
//             options: options.map(option => option.trim()),
//             answer: answer
//         });
//     } catch (error) {
//         console.error('Error generating question:', error);
//         res.status(500).json({ error: 'Failed to generate question' });
//     }
// });

// router.post('/submit-answer', async (req, res) => {
//     const { userAnswer, correctAnswer, score } = req.body;

//     const isCorrect = userAnswer === correctAnswer;
//     const updatedScore = isCorrect ? score + 1 : score;

//     res.json({ isCorrect, updatedScore });
// });

// module.exports = router;