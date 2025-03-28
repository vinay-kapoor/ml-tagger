import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";

dotenv.config();

const MyKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({apiKey: MyKey});

const app = express();
app.use(bodyParser.json());
app.use(express.static('.'));

// Endpoint to handle tagging request
app.post("/tag", async (req, res) => {
    const articleText = req.body.articleText;

const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "system", content:  "You are an expert in news categorization. Given the content of a news article, tag it with the most relevant categories from the following list: Politics, Economy, Technology, Health, Sports, Environment, Education, Entertainment, Science, Business.  Provide the tags as a comma-separated list of relevant tags, or state 'No relevant tags' if none apply."  },
        {
            role: "user",
            content: "Disruption at Barcelona airport, Enaire reports published at 17:22 17:22Enaire, the air navigation service provider in Spain, says due to the storms is causing disruption to arrivals at Barcelona airport. In a post on X, external, Enaire says the situation is being monitored and advises people to check with their airline for updates. Earlier today, it also reported disruption at the Palma de Mallorca airport.",
        },
    ],

});

const tagsOutput = console.log(completion.choices[0].message);

});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
