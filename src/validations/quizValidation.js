'use strict'
import { body, param } from 'express-validator';
import { Users } from '../models/index.js';

export const QuizValidator = [
    body("title").notEmpty().withMessage('title is required'),
    body('questions')
        .isArray()
        .withMessage('Questions should be an array'),
    body('questions.*.text')
        .isString()
        .notEmpty()
        .withMessage('Question text is required'),
    body('questions.*.options')
        .isObject()
        .withMessage('Options should be an object')
        .custom((options) => {
            const optionKeys = Object.keys(options);
            if (optionKeys.length < 2) {
              throw new Error('each question must have at least two options');
            }
            return true;
          }),
    body('questions.*.correct_ans').notEmpty().withMessage('correct_ans is required')
]

export const QuizIdValidator = [
    param("id").notEmpty().withMessage('id is required')
        .isNumeric(),
]