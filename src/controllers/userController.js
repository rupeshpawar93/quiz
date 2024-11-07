'use strict'

import { Users } from "../models/index.js"
import { ResponseBody } from "../utilties/index.js"
import { generateToken } from "../middlewares/auth.js";

const UserController = {
    signIn,
    signUp
}


/**
 * Handles signin.
 * @route POST /user/signup
 * @param {Object} req - The request body { name, username, password }.
 * @param {Object} res - The response object to send back the result.
 * @param {Function} next - The next middleware function to be executed.
 * @returns {Object} user details.
 */
function signUp(req, res, next) {
    const id = Users.length === 0 ? 1: Users.length+1; 
    const data = Users.push({ id, ...req.body});
    const responseBody = new ResponseBody(200, 'User Successful created', data)
    res.body = responseBody
    process.nextTick(next)
}

/**
 * Handles signin.
 * @route POST /user/signin
 * @param {Object} req - The request body { username, password }.
 * @param {Object} res - The response object to send back the result.
 * @param {Function} next - The next middleware function to be executed.
 * @returns {Object} user details with token and role.
 */
function signIn(req, res, next) {
    const { username, password } = req.body;
    // Check if No Users found in Users
    if (Users.length === 0) {
        return res.status(400).json({ error: [{ status: false, msg: "No User created yet!" }] })
    }

    const userData = Users.find(u=> {
        return u.username == username
    });
    // Check if User found in Users
    if(!userData) {
        return res.status(404).json({ error: [{ status: false, msg: "No user found"}] });
    }
    // Check if password of the user
    if(userData.password  != password) {
        return res.status(400).json({ error: [{ status: false, msg: "Password is wrong!"}] });
    }
    const token = generateToken({ id: userData.id });
    const responseBody = new ResponseBody(200, 'User Signin Successful', { token });
    res.body = responseBody
    process.nextTick(next);
}

export default UserController;