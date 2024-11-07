'use strict'

import { Results } from "../models/index.js";
import { ResponseBody } from "../utilties/index.js"

const ResultController = {
    getResult
}

/**
 * Handles fetching score detail for a quiz of a user.
 * @route GET /result/:id
 * @param {Object} req - The request object containing the quiz id in req params and user_id in req.
 * @param {Object} res - The response object to send back the result.
 * @param {Function} next - The next middleware function to be executed.
 */
function getResult(req, res, next) {
    const { id } = req.params;
    const { user: user_id } = req;
    const result = Results.find(result=> result.quiz_id == id && result.user_id == user_id);
    if(!result) {
        return res.status(404).json({ error: [{ status: false, msg: "No Quiz Found For User!"}] });
    }
    const responseBody = new ResponseBody(200, 'Result Of Quiz Fetched Successful', { result });
    res.body = responseBody
    process.nextTick(next);
}

export default ResultController;
