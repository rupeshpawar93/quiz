'use strict'

import { Quizs, Questions, Users } from "../models/index.js";
import { ResponseBody } from "../utilties/index.js"

const QuizController = {
    create,
    getById,
    checkUniqueQuiz
}

function create(req, res, next) {
    const user_id = req.user;
    const quiz_id = Quizs.length === 0 ? 1: Quizs.length + 1;
    const { title, questions } = req.body
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

function getById(req, res, next) {
    const { id } = req.params
    const quizResult = Quizs.find(quiz => {
        return quiz.id==id
    });
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

function checkUniqueQuiz(title) {
    if(Quizs.length === 0) {
        return true;
    }
    const result = Quizs.find(quiz=>quiz.title === title) ?? [];
    return result.length === 0 ? true: false;
}

export default QuizController;