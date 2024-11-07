import http from 'http'
import { validationResult } from 'express-validator';
import { Questions, Results } from '../models/index.js';

export const asyncWrapper = (fn) => {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export class ResponseBody {
  constructor(statusCode, message, data, error) {
    this.statusCode = statusCode
    this.status = http.STATUS_CODES[statusCode]
    this.msg = message
    this.data = data
    this.error = error
  }
}

export const handleResponse = (request, response, next) => {
  const resBody = response.body || {}
  const { statusCode } = resBody
  const handler = ([301, 302].indexOf(statusCode) > -1)
    ? ""
    : sendResponse

  handler(request, response, next)
}

const sendResponse = (request, response, next) => {
  let resBody = response.body || {}
  const { statusCode } = resBody
  if (!resBody || !statusCode) {
    resBody = new ResponseBody(500, 'Response Data Not Found!')
  }
  response.status(resBody.statusCode).json(resBody)
}

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  // if there is error then return Error
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next()
};

export const routeSanity = (request, response, next) => {
  request.isMatched = true
  process.nextTick(next)
};

// calculate the score based on right ans and wrong ans
export const calculateScore = (status, user_id, quiz_id, question_id, selected_option) => {
  const resultData = Results.find(result=> result.user_id == user_id && result.quiz_id == quiz_id);
  const questionCount = Questions.filter(question=> question.quiz_id == quiz_id).length;
  if (resultData) {
    if (status === 'incorrect') {
      resultData.score.incorrect = Number(resultData.score.incorrect+1);
    } else if (status === 'correct') {
      resultData.score.correct = Number(resultData.score.correct+1);
    }
    resultData.score.not_answered = questionCount - (resultData.score.incorrect + resultData.score.correct)
    resultData.answerList = [...resultData.answerList, { question_id, selected_option}]
    Results.splice(resultData.id, 1, resultData);
  } else {
    const id = Results.length === 0 ? 1: Results.length + 1;
    const resultData = {
      id,
      user_id,
      quiz_id: quiz_id,
      score: { correct: 0, incorrect: 0, not_answered: 0 },
      answerList: [{
          question_id,
          selected_option
      }]
    };
    if (status === 'incorrect') {
      resultData.score.incorrect = 1;
    } else if (status === 'correct') {
      resultData.score.correct = 1;
    }
    resultData.score.not_answered = questionCount - (resultData.score.incorrect + resultData.score.correct)
    Results.push(resultData);
  }
}