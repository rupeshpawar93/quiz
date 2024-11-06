'use strict'
import { body, query } from 'express-validator';
import { Users } from '../models/index.js';

export const UserSignInValidator = [
    body("username").notEmpty().withMessage("Provide valid username"),
    body("password").notEmpty().withMessage("Password is required")
]

export const UserSignUpValidator = [
    body("username").notEmpty().withMessage('Username is required')
        .custom((value, { req }) => {
            const response = Users.find(u=>u.username ===value);
            if(response) {
                return Promise.reject('username already exists');  
            }
            return true;
        }),
    body("password").isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            return Promise.reject('Passwords do not match');
        }
        return true;
    })
]