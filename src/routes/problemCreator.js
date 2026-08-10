const express = require('express');
const problemRouter = express.Router();
const { createProblem, updateProblem, deleteProblem, problemFetch, getAllProblems, solvedAllProblemByUser } = require('../controllers/problemController');

const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

problemRouter.post('/create', adminMiddleware, createProblem);
problemRouter.put('/:id', adminMiddleware, updateProblem);
problemRouter.delete('/:id', adminMiddleware, deleteProblem);

problemRouter.get('/:id', userMiddleware, getProblemById);
problemRouter.get('/', userMiddleware, getAllProblems);
problemRouter.get('/user',userMiddleware, solvedAllProblemByUser);

module.exports = problemRouter;
//create problem
//fetch
//update
//delete

