const mongoose = require('mongoose');
const { Schema } = mongoose;

const problemSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        minlength: 10
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    tags: {
        type: String,
        enum: ['arrays', 'strings', 'dynamic programming', 'graphs', 'trees', 'math', 'greedy', 'backtracking'],
        required: true
    },
    visibleTestCases: [
        {
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            },
            explanation: {
                type: String,
                required: true
            }
        }
    ],
    hiddenTestCases: [
        {
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            }
        }
    ],

    startCode:[
        {
            language: {
                type: String,
                required: true,
                enum: ['python', 'javascript', 'java', 'c++'],
            },
            initialCode: {
                type: String,
                required: true
            }
        }
    ],

    problemCreator :{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
}, { timestamps: true });

const Problem = mongoose.model('problems', problemSchema);

module.exports = Problem;
    