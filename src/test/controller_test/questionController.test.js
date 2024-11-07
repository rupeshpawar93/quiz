'use strict'

import { QuestionController } from '../../controllers/index.js';
import { Questions, Results } from '../../models/index.js';
import { calculateScore, ResponseBody } from '../../utilties/helper.js';

// Mock
jest.mock('../../models/index.js', () => ({
    Questions: [],
    Results: [],
}));
jest.mock('../../utilties/helper.js', () => ({
    calculateScore: jest.fn(),
    ResponseBody: jest.fn()
}));


describe('QuestionController.submit', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            user: 1,
            body: {
                question_id: 99,
                selected_option: 'a',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();

        calculateScore.mockClear();
        ResponseBody.mockClear();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('returns 404 when question is not found', () => {
        Questions.find = jest.fn(() => null); // No question found
        QuestionController.submit(req, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('returns 409 when question is already answered', () => {
        Questions.find = jest.fn(() => ({ id: 99, quiz_id: 1 }));
        Results.find = jest.fn(() => ({
            user_id: req.user,
            quiz_id: 1,
            answerList: [{ question_id: 99 }],
        }));
        QuestionController.submit(req, res, next);
        expect(res.status).toHaveBeenCalledWith(409);
    });

    test('returns 400 when answer is incorrect', () => {
        Questions.find = jest.fn(() => ({ id: 99, quiz_id: 1, correct_ans: 'b' }));
        Results.find = jest.fn(() => ({
            user_id: req.user,
            quiz_id: 1,
            answerList: [],
        }));

        QuestionController.submit(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('returns 200 when answer is correct', () => {
        Questions.find = jest.fn(() => ({ id: 99, quiz_id: 1, correct_ans: 'a' }));
        Results.find = jest.fn(() => ({
            user_id: req.user,
            quiz_id: 1,
            answerList: [],
        }));
        const responseBodyInstance = { status: 200, msg: 'answer is correct' };
        ResponseBody.mockImplementation(() => responseBodyInstance);
        QuestionController.submit(req, res, next);
        expect(ResponseBody).toHaveBeenCalledWith(200, 'answer is correct');
    });
});

describe('QuestionController.checkIsQuestionAnswered', () => {
    test('returns true if question is already answered', () => {
        Results.find = jest.fn(() => ({
            user_id: 1,
            quiz_id: 1,
            answerList: [{ question_id: 99 }],
        }));
        const response = QuestionController.checkIsQuestionAnswered(1, 1, 99);
        expect(response).toEqual(true);
    });

    test('returns false if question is already answered', () => {
        Results.find = jest.fn(() => ({
            user_id: 1,
            quiz_id: 1,
            answerList: [{ question_id: 100 }],
        }));
        const response = QuestionController.checkIsQuestionAnswered(1, 1, 99);
        expect(response).toEqual(false);
    });
});