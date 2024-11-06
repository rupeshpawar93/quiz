user
    id 
    name
    password
quiz
    id
    title

user_assigned_quiz
    user_id
    quiz_id

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
    is_correct

result
    quiz _id
    user_id
    score
    answers
