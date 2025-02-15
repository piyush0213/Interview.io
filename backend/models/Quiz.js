const mongoose = require('mongoose');
const {Schema} = mongoose;

const QuizSchema = new Schema({
    userID : {
        type: String,
    },
    qty: {
        type: Number,
    },
    questions: {
        type: Array,
    },
    techstack: {
        type: String,
    },
    difficulty: {
        type: String,
    },
    correct_answers: {
        type: Array,
    },
    correct_answers_index: {
        type: Array,
    },
    chosen_answers: {
        type: Array,
    },
    chosen_answers_index: {
        type: Array,
    },
    score : {
        type: Number,
    },
    status: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Quiz', QuizSchema);