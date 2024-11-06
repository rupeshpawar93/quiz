'use strict'

import Express from 'express'
import { ResultController } from "../controllers/index.js";
import { asyncWrapper, validate, routeSanity } from "../utilties/index.js";
import { verifyToken } from "../middlewares/auth.js"

const ResultRouter = new Express.Router()
const { getResult } = ResultController

ResultRouter.get('/:quizId', validate, routeSanity, asyncWrapper(getResult));

export default ResultRouter;