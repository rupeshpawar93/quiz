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
* options
* correct_option
**/ 
const Questions = [];

/*
* id
* question_id
* selected_options
**/ 
const Answers = []

const Result = []

// Export all models as named exports
export {
  Users,
  Quizs,
  Questions,
  Answers,
  Result
};
