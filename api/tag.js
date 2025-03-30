import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
    // Only allow POST method
    if (req.method !== 'POST') {
        console.log("❌ Method not allowed:", req.method);
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        console.log("🔍 Processing article tagging request...");
        const { articleText } = req.body;
        
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
                { 
                    role: "system", 
                    content: "You are an expert in news categorization. Given the content of a news article, tag it with the most relevant categories based on your knowledge of news article tags. Provide the tags as a comma-separated list of relevant tags, or state 'No relevant tags' if none apply." 
                },
                {
                    role: "user",
                    content: articleText,
                },
            ],
        });
        
        const endTime = Date.now();
        console.log(`✅ OpenAI response received in ${endTime - startTime}ms`);

        const tagsOutput = completion.choices[0].message.content;
        console.log(`🏷️ Generated tags: ${tagsOutput}`);
        
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        return res.status(200).json({ tags: tagsOutput });
    } catch (error) {
        console.error("❌ Error processing request:", error);
        return res.status(500).json({ 
            error: "Failed to process article", 
            details: error.message 
        });
    }
}

// Add OPTIONS handler for CORS preflight requests
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb'
        }
    }
};

export default function handler(req, res) {
    console.log("🏥 Health check requested");
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ 
        status: "ok", 
        timestamp: new Date().toISOString() 
    });
}