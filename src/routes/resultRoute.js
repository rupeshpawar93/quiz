'use strict'

import Express from 'express'
import { ResultController } from "../controllers/index.js";
import { asyncWrapper, validate, routeSanity } from "../utilties/index.js";
import { verifyToken } from "../middlewares/auth.js"
import { QuizIdValidator } from "../validations/index.js";

const ResultRouter = new Express.Router()
const { getResult } = ResultController

ResultRouter.get('/:id', QuizIdValidator, validate, routeSanity, asyncWrapper(getResult));

export default ResultRouter;