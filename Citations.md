# Code Citations

## CORS Headers Implementation
Source: https://github.com/mathursrus/AmplifyCares/blob/06d846be490b7d6f183bc42d4ddade50d9f2eae7/server/app.js
License: Unknown
Used in: `/api/tag.js`

The following CORS headers implementation was adapted from the source:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

## Project Dependencies
- OpenAI Node.js SDK
- Tailwind CSS
- Express.js (original implementation)
- Vercel Serverless Functions (current implementation)