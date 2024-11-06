'use strict'

import Express from 'express'
import { QuestionController } from "../controllers/index.js";
import { asyncWrapper, validate, routeSanity } from "../utilties/index.js";
import { verifyToken } from "../middlewares/auth.js"

const QuestionRouter = new Express.Router()
const { submit } = QuestionController

QuestionRouter.post('/submit-ans', validate, routeSanity, asyncWrapper(submit));


export default QuestionRouter;