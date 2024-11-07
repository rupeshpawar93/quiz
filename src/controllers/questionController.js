'use strict'

import { Questions, Results } from "../models/index.js";
import { calculateScore } from "../utilties/helper.js";
import { ResponseBody } from "../utilties/index.js"

const QuestionController  = {
    submit,
    checkIsQuestionAnswered
}

/**
 * Handles submitting an answer for a specific question.
 * @route POST /question/submit-ans
 * @param {Object} req - The request object containing the user's selected_option, question_id and user_id.
 * @param {Object} res - The response object to send back the result.
 * @param {Function} next - The next middleware function to be executed.
 */
function submit(req, res, next) {
    const { user: user_id } = req;
    const { question_id, selected_option } = req.body;
    const questionResponse = Questions.find(question=> question.id == question_id);
    // Check if question exists or not
    if(!questionResponse) {
        return res.status(404).json({ error: [{ status: false, msg: 'question not found'}] });
    }
    // Check if the user has already answered this question
    if(checkIsQuestionAnswered(user_id, questionResponse.quiz_id, question_id)) {
        return res.status(409).json({ error: [{ status: false, msg: 'question already answered'}] });
    }
    // Check if the user has given wrong ans
    if(questionResponse.correct_ans != selected_option) {
        calculateScore('incorrect', user_id, questionResponse.quiz_id, question_id, selected_option); // update score for wrong ans
        return res.status(400).json({ error: [{ status: false, msg: `wrong answer correct ans is ${questionResponse.correct_ans}`}] });
    }
    calculateScore('correct', user_id, questionResponse.quiz_id, question_id, selected_option);  // update score for right ans
    const responseBody = new ResponseBody(200, 'answer is correct');
    res.body = responseBody
    process.nextTick(next);
}

/**
 * Handles checking is question already answered by user.
 * @param {Number} user_id - login user_id.
 * @param {Number} quiz_id - id of quiz for which user is submitting ans.
 * @param {Number} question_id - id of question for which user is submitting ans.
 * @returns {Boolean}
 */
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