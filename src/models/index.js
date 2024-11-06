'use strict'
/*
* id
* username
* password
* confirmPassword
* admin
**/ 
const Users = [];


/*
* id
* title
* created_by
**/ 
const Quizs = [];

/*
* id
* quiz_id
* text
* options: 
* correct_option: string
**/ 
const Questions = [];

/*
* id: number
* question_id: number
* selected_options: string
**/ 
const Answers = []

/*
* id
* user_id: number
* quiz_id: number
* score: { correct, incorrect, notanswered }
* answerList: Array<{ question_id, answer }>
*/
const Results = []

// Export all models as named exports
export {
  Users,
  Quizs,
  Questions,
  Answers,
  Results
};
