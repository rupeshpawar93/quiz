'use strict'

import { Quizs, Questions, Users } from "../models/index.js";
import { ResponseBody } from "../utilties/index.js"

const QuizController = {
    create,
    getById,
    checkUniqueQuiz
}

/**
 * Handles submitting a new quiz.
 * @route POST /quiz/create
 * @param {Object} req - The request object containing the quiz details, question details in req body and user_id in req.
 * @param {Object} res - The response object to send back the result.
 * @param {Function} next - The next middleware function to be executed.
 */
function create(req, res, next) {
    const user_id = req.user;
    const quiz_id = Quizs.length === 0 ? 1: Quizs.length + 1;
    const { title, questions } = req.body
    // Check if Quiz title is not duplicate
    if(!checkUniqueQuiz(title)) {
        return res.status(409).json({ error: [{ status: false, msg: 'quiz already exist for this title'}] });
    }
    Quizs.push({ id: quiz_id, title});

    if(questions.length>0) {
        let question_id = Questions.length === 0 ? 1: Questions.length+1;
        questions.map(question=> {
            Questions.push({
                id: question_id,
                quiz_id,
                ...question
            })
            ++question_id;

        })
    }
    const responseBody = new ResponseBody(200, 'Quiz Created Successful');
    res.body = responseBody
    process.nextTick(next);
}

/**
 * Handles fetching quiz details for specific id.
 * @route GET /quiz/:id
 * @param {Object} req - The request object containing the quiz id in req params and user_id in req.
 * @param {Object} res - The response object to send back the result.
 * @param {Function} next - The next middleware function to be executed.
 */
function getById(req, res, next) {
    const { id } = req.params
    const quizResult = Quizs.find(quiz => {
        return quiz.id==id
    });
    // Check if Quiz exists
    if(!quizResult) {
        return res.status(404).json({ error: [{ status: false, msg: "No Quiz Found For this Id!"}] }); 
    }
    let questionResult = Questions.filter(question=> {
        return question.quiz_id == id ? true : false;
    })
    .map(question => {
        const { id: question_id, text, options } = question;
        return { question_id, text, options };
    })
    const responseBody = new ResponseBody(200, 'Quiz fetched Successful', { quiz: { ...quizResult, question: questionResult }});
    res.body = responseBody
    process.nextTick(next);
}

/**
 * Check if quiz is unique.
 * @param {String} title - title of the quiz.
 * @returns {Boolean}
 */
function checkUniqueQuiz(title) {
    if(Quizs.length === 0) {
        return true;
    }
    const result = Quizs.find(quiz=>quiz.title === title) ?? [];
    return result.length === 0 ? true: false;
}

export default QuizController;