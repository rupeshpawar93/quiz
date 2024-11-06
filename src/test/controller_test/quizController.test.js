'use strict'

import { QuizController } from '../../controllers/index.js';
import { Quizs, Results } from '../../models/index.js';
import { calculateScore, ResponseBody } from '../../utilties/helper.js';

// Mock
jest.mock('../../models/index.js', () => ({
    Quizs: [{ id: 1,
        title: 'Justice League'}],
    Results: [],
}));
jest.mock('../../utilties/helper.js', () => ({
    ResponseBody: jest.fn()
}));

describe('QuizController.create', () => {
    let req, res, next;
    let Quiz;

    beforeEach(() => {
        req = {
            user: 1,
            body: {
                    title: "Justice League",
                    questions: [
                        {
                            "text": "hulk is ?",
                            "options": {
                                a: "god",
                                b: "monster",
                                c: "man"
                            },
                            correct_ans: "a"
                        }
                    ]
                }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        ResponseBody.mockClear();
    });

    test('returns 409 when quiz title is repeated', () => {
        Quizs.find = jest.fn(() => ({
            id: 1,
            title: 'Justice League'
        }));
        QuizController.create(req, res, next);
        expect(res.status).toHaveBeenCalledWith(409);
    });

    // test('returns 409 when question is already answered', () => {
    //     Questions.find = jest.fn(() => ({ id: 99, quiz_id: 1 }));
    //     Results.find = jest.fn(() => ({
    //         user_id: req.user,
    //         quiz_id: 1,
    //         answerList: [{ question_id: 99 }],
    //     }));
    //     QuestionController.submit(req, res, next);
    //     expect(res.status).toHaveBeenCalledWith(409);
    // });

    // test('returns 400 when answer is incorrect', () => {
    //     Questions.find = jest.fn(() => ({ id: 99, quiz_id: 1, correct_ans: 'b' }));
    //     Results.find = jest.fn(() => ({
    //         user_id: req.user,
    //         quiz_id: 1,
    //         answerList: [],
    //     }));

    //     QuestionController.submit(req, res, next);
    //     expect(res.status).toHaveBeenCalledWith(400);
    // });

    // test('returns 200 when answer is correct', () => {
    //     Questions.find = jest.fn(() => ({ id: 99, quiz_id: 1, correct_ans: 'a' }));
    //     Results.find = jest.fn(() => ({
    //         user_id: req.user,
    //         quiz_id: 1,
    //         answerList: [],
    //     }));
    //     const responseBodyInstance = { status: 200, message: 'answer is correct' };
    //     ResponseBody.mockImplementation(() => responseBodyInstance);
    //     QuestionController.submit(req, res, next);
    //     expect(ResponseBody).toHaveBeenCalledWith(200, 'answer is correct');
    // });
});