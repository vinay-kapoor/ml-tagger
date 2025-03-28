const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { OpenAIApi, Configuration, default: OpenAI } = require("openai");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('.'));

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: apiKey
});

// Endpoint to handle tagging request
app.post("/tag", async (req, res) => {
    const articleText = req.body.articleText;

    try {
        const prompt = `
        You are an expert in news categorization. Given the content of a news article, tag it with the most relevant categories from the following list:
        Politics, Economy, Technology, Health, Sports, Environment, Education, Entertainment, Science, Business.

        Article: "${articleText}"
        
        Provide the tags as a comma-separated list of relevant tags, or state "No relevant tags" if none apply.
        `;


        const response = await openai.chat.completions.create({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 50,
            temperature: 0.2,
        });

        const tagsResponse = response.data.choices[0].text.trim();
        res.json({ tags: tagsResponse });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to retrieve tags" });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
