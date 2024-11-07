Quiz is micro-service which allow user create quiz by adding question and its options. Built in expressJs Node framework and in-memory used to store all the data.

Schema
user
    id 
    name
    password

quiz
    id
    title

questions
    id
    question
    option
    correct_ans
    quiz_id

answer
    id
    question_id
    selected_option

result
    quiz _id
    user_id
    score - object
        correct
        incorrect
        not_answered
    answers - array
        question_id
        selected_option


Installation:
1. run command: npm i (install all the dependencies)
2. add .env file
3. run command: npm run start (start the service)

Installation via Docker:
1. run command in quiz directory: docker build -t quiz .
2. run command to start quiz service: docker run -p 3000:3000 quiz:latest