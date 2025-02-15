// server/controllers/sentimentController.js
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const analyzeSentiment = async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) return res.status(400).json({ error: "No text provided" });

        const response = await openai.chat.completions.create({
            messages: [{ role: "system", content: `Analyze sentiment and return a response: ${text}` }],
            model: "gpt-4-turbo",
        });

        res.json({ sentiment: response.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: "Sentiment analysis failed" });
    }
};
