import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin  } from '../utils.js';
import Result from '../models/resultModel.js';

const resultRouter = express.Router();

resultRouter.get(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const results = await Result.find({});
    res.send(results);
  })
);

resultRouter.post(
    '/add',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      console.log(req.body.result);
      const newResult = new Result ({
        user: req.user._id,
        testName: req.body.result.testName,
        question1: req.body.result.question1,
        keywords1: req.body.result.keywords1,
        answer1: req.body.result.answer1,
        audioURL1: req.body.result.audioURL1,
        question2: req.body.result.question2,
        keywords2: req.body.result.keywords2,
        answer2: req.body.result.answer2,
        audioURL2: req.body.result.audioURL2,
      });

      const result = await newResult.save();
      res.status(201).send({ message: 'New Result Created', result});
    })
);

resultRouter.get(
    '/mine',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const results = await Result.find({ user: req.user._id });
      res.send(results);
    })
  );

export default resultRouter;