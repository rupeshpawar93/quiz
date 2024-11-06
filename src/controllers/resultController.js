'use strict'

import { Results } from "../models/index.js";
import { ResponseBody } from "../utilties/index.js"

const ResultController = {
    getResult
}

async function getResult(req, res, next) {
    const { quizId } = req.params;
    const { user: user_id } = req;
    console.log("----------params", req.params);
    console.log("-------user", req.user);
    const result = Results.find(result=> result.quiz_id == quizId && result.user_id == user_id);
    console.log("---------result", result);
    if(!result) {
        return res.status(404).json({ error: [{ status: false, msg: "No Quiz Found For User!"}] });
    }
    const responseBody = new ResponseBody(200, 'Result Of Quiz Fetched Successful', { result });
    res.body = responseBody
    process.nextTick(next);
}

export default ResultController;
