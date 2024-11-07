'use strict'

import { Results } from "../models/index.js";
import { ResponseBody } from "../utilties/index.js"

const ResultController = {
    getResult
}

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
