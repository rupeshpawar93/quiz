'use strict'

import { Questions, Results } from "../models/index.js";
import { calculateScore } from "../utilties/helper.js";
import { ResponseBody } from "../utilties/index.js"

const QuestionController  = {
    submit
}

async function submit(req, res, next) {
    const { user: user_id } = req;
    const { question_id, selected_option } = req.body;
    const questionResponse = Questions.find(question=> question.id == question_id);
    if(!questionResponse) {
        return res.status(404).json({ error: [{ status: false, msg: 'question not found'}] });
    }
    if(checkIsQuestionAnswered(user_id, questionResponse.quiz_id, question_id)) {
        return res.status(409).json({ error: [{ status: false, msg: 'question already answered'}] });
    }
    if(questionResponse.correct_ans != selected_option) {
        calculateScore('incorrect', user_id, questionResponse.quiz_id, question_id, selected_option);
        return res.status(400).json({ error: [{ status: false, msg: `wrong answer correct ans is ${questionResponse.correct_ans}`}] });
    }
    calculateScore('correct', user_id, questionResponse.quiz_id, question_id, selected_option);
   
    const responseBody = new ResponseBody(200, 'answer is correct');
    res.body = responseBody
    process.nextTick(next);
}

function checkIsQuestionAnswered(user_id, quiz_id, question_id) {
    let exists = false;
    const resultData = Results.find(result=> result.user_id == user_id && result.quiz_id == quiz_id);
    if(!resultData) {
        return exists;
    }
    for( let ans of resultData.answerList) {
        if(ans.question_id ==  question_id) {
            exists = true;
            break
        }
    }
    return exists;

}

export default QuestionController;