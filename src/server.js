import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const MyKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({apiKey: MyKey});

const app = express();

// Middleware
app.use(cors()); // Add CORS support

// Request logging middleware - log all incoming requests
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`\n[${timestamp}] 📥 ${req.method} ${req.url}`);
    console.log(`Headers: ${JSON.stringify(req.headers, null, 2)}`);
    next();
});

// Body parsing middleware with logging
app.use(bodyParser.json({
    verify: (req, res, buf) => {
        if (buf && buf.length) {
            req.rawBody = buf.toString('utf8');
            console.log(`Request Body: ${req.rawBody}`);
        }
    }
}));

// Response logging middleware
app.use((req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(body) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] 📤 Response to ${req.method} ${req.url}`);
        console.log(`Status: ${res.statusCode}`);
        console.log(`Body: ${body}`);
        console.log('-'.repeat(50));
        
        return originalSend.call(this, body);
    };
    
    next();
});

app.use(express.static('.'));

// Endpoint to handle tagging request
app.post("/api/tag", async (req, res) => {
    try {
        console.log("🔍 Processing article tagging request...");
        const articleText = req.body.articleText;
        
        if (!articleText) {
            console.log("❌ Error: No article text provided");
            return res.status(400).json({ error: "Article text is required" });
        }

        console.log(`📝 Article length: ${articleText.length} characters`);
        console.log(`📝 Article preview: ${articleText.substring(0, 100)}...`);
        
        console.log("🤖 Sending request to OpenAI...");
        const startTime = Date.now();
        
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an expert in news categorization. Given the content of a news article, tag it with the most relevant categories from the following list: Politics, Economy, Technology, Health, Sports, Environment, Education, Entertainment, Science, Business. Provide the tags as a comma-separated list of relevant tags, or state 'No relevant tags' if none apply." },
                {
                    role: "user",
                    content: articleText,
                },
            ],
        });
        
        const endTime = Date.now();
        console.log(`✅ OpenAI response received in ${endTime - startTime}ms`);

        // Send the response back to the client
        const tagsOutput = completion.choices[0].message.content;
        console.log(`🏷️ Generated tags: ${tagsOutput}`);
        
        res.json({ tags: tagsOutput });
    } catch (error) {
        console.error("❌ Error processing request:", error);
        res.status(500).json({ error: "Failed to process article", details: error.message });
    }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
    console.log("🏥 Health check requested");
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// For local development
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
        console.log(`📊 Traffic logging is enabled`);
        console.log(`🔍 Try accessing http://localhost:${PORT} in your browser`);
        console.log(`🔄 Press Ctrl+C to stop the server\n`);
    });
}

// Export for Vercel serverless deployment
export default app;