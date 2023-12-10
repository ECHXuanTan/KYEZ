import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import axios from 'axios';
import Test from '../models/testModel.js';

const testRouter = express.Router();

    testRouter.get(
        '/',
        expressAsyncHandler(async (req, res) => {
        const tests = await Test.find({});
        res.send(tests);
        })
    );

    testRouter.get('/:id', async (req, res) => {
        const test = await Test.findById(req.params.id);
        if (test) {
        res.send(test);
        } else {
        res.status(404).send({ message: 'Test Not Found' });
        }
    });

    testRouter.post('/phrase', async (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        
        const receivedText = req.body.text;
        // console.log("req.body.text",req.body.text )
        const obj = { str: `${receivedText}` };
        const reqStr = JSON.stringify(obj);
            const headers = { 
                headers: {
                    'Content-Type': 'text/plain'
                }
            };
      
            try {
                const phraseResponse = await axios.post(`https://texsmart.qq.com/api`, reqStr, headers);
                res.send({ phrase: phraseResponse.data.phrase_list });
                // console.log("phraseResponse.data",phraseResponse.data.phrase_list )
            } catch (err) {
                res.status(401).send('There was an error.');
            }
        
      });


export default testRouter;