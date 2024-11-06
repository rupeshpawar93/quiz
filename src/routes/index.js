'use strict'

import { ResponseBody, handleResponse } from '../utilties/index.js'
import QuizRouter from './quizRoute.js';
import UserRouter from './userRoute.js';
import QuestionRouter from './questionRoute.js';
import ResultRouter from './resultRoute.js';

const Routes = [
  { path: '/user', router: UserRouter },
  { path: '/quiz', router: QuizRouter },
  { path: '/question', router: QuestionRouter },
  { path: '/result', router: ResultRouter }
]

Routes.init = (app) => {
  if (!app || !app.use) {
    console.error('[Error] Route Initialization Failed: app / app.use is undefined')
    return process.exit(1)
  }

  // Custom Routes
  Routes.forEach(route => app.use(route.path, route.router))

  // Final Route Pipeline
  app.use('*', (request, response, next) => {
    if (!request.isMatched) {
      const { method, originalUrl } = request
      const message = `Cannot ${method} ${originalUrl}`
      const error = new ResponseBody(404, message)
      response.body = error
    }
    return handleResponse(request, response, next)
  })

  // Route Error Handler
  app.use((error, request, response, next) => {
    if (!error) { 
        return process.nextTick(next) 
    }
    const { statusCode = 500, message } = error
    let responseBody

    if (error.constructor.name === 'ResponseBody') {
      responseBody = error
    } else {
      responseBody = new ResponseBody(statusCode, message, error)
    }

    response.body = responseBody
    return handleResponse(request, response, next)
  })
}

export default Routes
