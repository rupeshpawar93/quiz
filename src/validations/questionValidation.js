'use strict'
import { body } from 'express-validator';
import { Users } from '../models/index.js';

export const QuestionAnsValidator = [
    body("question_id").notEmpty().withMessage('question_id is required'),
    body('selected_option').notEmpty().withMessage('selected_option is required')
]
