import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import userRouter from "./routes/userRoutes.js";
import testRouter from "./routes/testRoutes.js";
import resultRouter from "./routes/resultRoutes.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/users', userRouter);
app.use('/api/tests', testRouter);
app.use('/api/results', resultRouter);

app.get('/api/get-speech-token', async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  const speechKey = process.env.SPEECH_KEY;
  const speechRegion = "southeastasia";
  console.log("speechKey",speechKey )
  if (speechKey === 'paste-your-speech-key-here' || speechRegion === 'paste-your-speech-region-here') {
      res.status(400).send('You forgot to add your speech key or region to the .env file.');
  } else {
      const headers = { 
          headers: {
              'Ocp-Apim-Subscription-Key': speechKey,
              'Content-Type': 'application/x-www-form-urlencoded'
          }
      };

      try {
          const tokenResponse = await axios.post(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, null, headers);
          res.send({ token: tokenResponse.data, region: speechRegion });
      } catch (err) {
          res.status(401).send('There was an error authorizing your speech key.');
      }
  }
});

const port = 5000;
app.listen(port, () => {
    console.log(`serve at http://localhost:${port}`)
})