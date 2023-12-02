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

export default testRouter;