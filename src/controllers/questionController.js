'use strict'

import { Questions, Results } from "../models/index.js";
import { ResponseBody } from "../utilties/index.js"

const QuestionController  = {
    submit
}

async function submit(req, res, next) {
    const { user: user_id } = req;
    const { question_id, selected_option } = req.body;
    const questionResponse = Questions.find(question=> question.id == question_id);
    console.log("----------questionResponse", questionResponse);
    if(questionResponse.correct_ans != selected_option) {
        return res.status(400).json({ error: [{ status: false, msg: `wrong answer correct ans is ${questionResponse.correct_ans}`}] });
    }
    const resultReponse = Results.find(result=> result.user_id == user_id && result.quiz_id == questionResponse.quiz_id);
    console.log("-----------result", resultReponse);
    if(!resultReponse) {
        const id = Results.length === 0 ? 1: Results.length + 1;
        const resultData = {
            id,
            user_id,
            quiz_id: questionResponse.quiz_id,
            score: { correct: 1, incorrect: 0, not_answered: 0 },
            answerList: [{
                question_id,
                selected_option
            }]
        };
        Results.push(resultData);
    } else {
        const resultData = {
            ...resultReponse,
            score: { correct: Number(resultReponse.score.correct)+1 , incorrect: 0, not_answered: 0 },
            answerList: [...resultReponse.answerList, {
                question_id,
                selected_option
            }]
        };
        Results.splice(Number(resultData.id)-1, 1, resultData);
    }
    console.log("-------result overall", Results);
    const responseBody = new ResponseBody(200, 'answer is correct');
    res.body = responseBody
    process.nextTick(next);
}

export default QuestionController;