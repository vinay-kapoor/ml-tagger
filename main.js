import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from 'public' directory

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: apiKey
});

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' }); // Serve your HTML file
});

app.post('/analyze', async (req, res) => {
  try {
    const imageUrl = req.body.imageUrl; // Get the URL from the form submission

    console.log('Received request with data:', req.body);

    console.log('Sending request to OpenAI with URL:', req.body.imageUrl);

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "IS there a price mentioned on this image? I want the price read and reported along with the currency, upto 4 decimal points. Just report the product name and price and do not bother explaining it. If there is more than one price, then report it as a name value pair, with product number as the name and dollar amount as the value." },
            {
              type: "image_url",
              image_url: imageUrl,
            },
          ],
        },
      ],
      max_tokens: 150 // Adjust this value based on your requirements
    });

    console.log('Received response from OpenAI:', response);

    console.log('OpenAI response choice structure:', response.choices[0]);

    console.log('Sending response back to client:', response.choices[0].message.content);

    res.send(response.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(`Error processing your request: ${error.message}`);
  }
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
