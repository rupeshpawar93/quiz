'use strict'

import { Users } from "../models/index.js"
import { ResponseBody } from "../utilties/index.js"
import { generateToken } from "../middlewares/auth.js";

const UserController = {
    signIn,
    signUp
}

/**
 * create user.
 * @route POST /signup
 * @param req - The request body { name, username, password, role }.
 * @param res - The response object.
 * @returns user details.
 */
async function signUp(req, res, next) {
    const id = Users.length === 0 ? 1: user.length+1; 
    const data = await Users.push({ id, ...req.body});
    const responseBody = new ResponseBody(200, 'User Successful created', data)
    res.body = responseBody
    process.nextTick(next)
}

/**
 * create signin.
 * @route POST /signin
 * @param req - The request body { username, password }.
 * @param res - The response object.
 * @returns user details with token and role.
 */
async function signIn(req, res, next) {
    const { username, password } = req.body;
    
    if (Users.length === 0) {
        return res.status(400).json({ error: [{ status: false, msg: "No User created yet!" }] })
    }

    const userData = Users.find(u=> {
        return u.username == username
    });

    if(!userData) {
        return res.status(404).json({ error: [{ status: false, msg: "No user found"}] });
    }
    if(userData.password  != password) {
        return res.status(400).json({ error: [{ status: false, msg: "Password is wrong!"}] });
    }
    const token = generateToken({ id: userData.id });
    const responseBody = new ResponseBody(200, 'User Signin Successful', { token });
    res.body = responseBody
    process.nextTick(next);
}

export default UserController;