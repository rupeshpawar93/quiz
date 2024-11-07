'use strict'

import Express from 'express'
import { QuizController } from "../controllers/index.js";
import { asyncWrapper, validate, routeSanity } from "../utilties/index.js";
import { verifyToken } from "../middlewares/auth.js"
import { QuizValidator, QuizIdValidator } from "../validations/index.js";

const QuizRouter = new Express.Router()
const { create, getById } = QuizController

QuizRouter.post('/create', QuizValidator, validate, routeSanity, asyncWrapper(create));
QuizRouter.get('/:id', QuizIdValidator, validate, routeSanity, asyncWrapper(getById));

export default QuizRouter;