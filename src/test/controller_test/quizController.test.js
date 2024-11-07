'use strict'

import { QuizController } from '../../controllers/index.js';
import { Quizs, Results, Questions } from '../../models/index.js';
import { calculateScore, ResponseBody } from '../../utilties/helper.js';


jest.mock('../../utilties/helper.js', () => ({
    ResponseBody: jest.fn()
}));

describe('QuizController.create', () => {
    let req, res, next;
    let Quizs = [];
    let Questions = [];
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
    afterEach(() => {
        Quizs = [];
        Questions = [];
        jest.clearAllMocks()
    })

    test('returns 200 when quiz is created', () => {
        const responseBodyInstance = { status: 200, msg: 'Quiz Created Successful' };
        ResponseBody.mockImplementation(() => responseBodyInstance);
        QuizController.create(req, res, next);
        expect(ResponseBody).toHaveBeenCalledWith(200, 'Quiz Created Successful');
    });

    test('returns 409 when quiz title is duplicate and Quizs length is greater then zero', () => {
        Quizs.push({
            title: "Justice League",
            questions: [
                {
                    "text": "batman is ?",
                    "options": {
                        a: "god",
                        b: "monster",
                        c: "man"
                    },
                    correct_ans: "a"
                }
            ]
        })
        QuizController.create(req, res, next);
        expect(res.status).toHaveBeenCalledWith(409);
    });
});

describe('QuizController.getById', () => {
    let req, res, next;
    let Quizs;
    let Questions;
    beforeEach(() => {
        Quizs = [];
        req = {
            user: 1,
            params: {
                id: 2
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        ResponseBody.mockClear();
    });
    afterEach(() => {
        Quizs = [];
        Questions = [];
    });

    test('returns 404 when no quiz found for id', () => {
        QuizController.getById(req, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('returns 200 when  quiz found for id', () => {
        req.params.id = 1;
        const response = {"quiz": {"id": 1, "question": [{"options": {"a": "god", "b": "monster", "c": "man"}, "question_id": 1, "text": "hulk is ?"}], "title": "Justice League"}};
        const responseBodyInstance = { status: 200, msg: 'Quiz fetched Successful' };
        ResponseBody.mockImplementation(() => responseBodyInstance);
        QuizController.getById(req, res, next);
        expect(ResponseBody).toHaveBeenCalledWith(200, 'Quiz fetched Successful', response);
    });
});

describe('QuizController.checkUniqueQuiz', () => {
    let Quizs = [];
    afterEach(() => {
        Quizs = [];
    });
    test('returns true if quiz is unique', () => {
        const response = QuizController.checkUniqueQuiz('test');
        expect(response).toEqual(true);
    });

    test('returns false if quiz is unique', () => {
        const response = QuizController.checkUniqueQuiz('Justice League');
        expect(response).toEqual(false);
    });
});