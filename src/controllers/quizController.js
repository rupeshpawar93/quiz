'use strict'

import { Quizs, Questions, Users } from "../models/index.js";
import { ResponseBody } from "../utilties/index.js"

const QuizController = {
    create,
    getById
}

async function create(req, res, next) {
    const user_id = req.user;
    const quiz_id = Quizs.length === 0 ? 1: Quizs.length + 1;
    const { title, questions } = req.body
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

async function getById(req, res, next) {
    const { id } = req.params
    const quizResult = Quizs.find(quiz => {
        return quiz.id==id
    });
    let questionResult = Questions.filter(question=> {
        return question.quiz_id == id ? true : false;
    }).map(question => {
        const { id: question_id, text, options } = question;
        return { question_id, text, options };
    })
    const responseBody = new ResponseBody(200, 'Quiz Created Successful', { quiz: { ...quizResult, question: questionResult }});
    res.body = responseBody
    process.nextTick(next);
}

export default QuizController;