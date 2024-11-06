import Express from 'express'
import { QuizController } from "../controllers/index.js";
import { asyncWrapper, validate, routeSanity } from "../utilties/index.js";
import { verifyToken } from "../middlewares/auth.js"

const QuizRouter = new Express.Router()
const { create, getById } = QuizController

QuizRouter.post('/create', validate, routeSanity, asyncWrapper(create));
QuizRouter.get('/:id', validate, routeSanity, asyncWrapper(getById));

export default QuizRouter;