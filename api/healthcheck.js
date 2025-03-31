export default function handler(req, res) {
    console.log("🏥 Health check requested");
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ 
        status: "ok", 
        timestamp: new Date().toISOString() 
    });
}