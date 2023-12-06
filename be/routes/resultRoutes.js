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
    '/',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const newResult = new Result ({
        user: req.user._id,
        testName: req.body.testName,
        question1: req.body.question1,
        keywords1: req.body.keywords1,
        answer1: req.body.answer1,
        audioName1: req.body.audioName1,
        question2: req.body.question2,
        keywords2: req.body.keywords2,
        answer2: req.body.answer2,
        audioName2: req.body.audioName2,
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