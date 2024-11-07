'use strict'

import { ResultController } from '../../controllers/index.js';
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


describe('ResultController.getResult', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            user: 1,
            params: {
                quizId: 1
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
        jest.clearAllMocks();
    });

    test('returns 404 when quiz is not found for user', () => {
        Results.push({
            quiz_id: 2,
            user_id: 1,
            score: {
                correct: 0,
                incorrect: 0,
                not_answered: 0
            }
        });
        ResultController.getResult(req, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('returns 200 when quiz is  found for user', () => {
        Results.push({
            quiz_id: 1,
            user_id: 1,
            score: {
                correct: 0,
                incorrect: 0,
                not_answered: 0
            }
        });
        const response = {"result": {"quiz_id": 1, "score": {"correct": 0, "incorrect": 0, "not_answered": 0}, "user_id": 1}};
        const responseBodyInstance = { status: 200, msg: 'Result Of Quiz Fetched Successful' };
        ResponseBody.mockImplementation(() => responseBodyInstance);
        ResultController.getResult(req, res, next);
        expect(ResponseBody).toHaveBeenCalledWith(200, 'Result Of Quiz Fetched Successful', response);
    });
});
