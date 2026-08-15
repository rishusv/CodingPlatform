const {getLanguageId, submitBatch , submitToken} = require('../utils/problemUtility');
const Problem = require('../models/proble');

const createProblem = async (req, res) => {
    try {
        const { title, description, 
                difficulty, tags, visibleTestCases,
                hiddenTestCases, startCode, 
                referenceSolution,problemCreator } = req.body;

        for( const element of referenceSolution)
        {
            if(!['javascript', 'java', 'c++'].includes(element.language)){
                return res.status(400).json({ error: `Invalid language in referenceSolution: ${element.language}` });
            }

            const languageId = getLanguageId(element.language);
            if(!languageId)
            {
                return res.status(400).json({ error: `Language ID not found for language: ${element.language}` });
            }
           // creating batch submissions for Judge0 API to validate the reference solution and test cases
            const submissions = visibleTestCases.map((testCase) => ({
                source_code: element.completeCode,
                language_id: languageId,
                stdin: testCase.input,
                expected_output: testCase.output
            }));

            const submitResult = await submitBatch(submissions);

            const resultToken = submitResult.map((result) => result.token);

            const testResult = await submitToken(resultToken);

            for(const test of testResult)
            {
                if(test.status_id !=3)
                {
                    res.status(400).send("Error occured");
                }
            }


            

            //source code
            //language_id
            //stdin
            //stdout
        }


        //intergrate Judge0 API here to validate the reference solution and test cases before saving the problem

        //we can store it in our DB

        const userId = req.result._id; // Get the user ID from the request object

        // Create a new problem with the user ID
        const problem = await Problem.create({ title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution, problemCreator: userId });

        res.status(201).json({ message: "Problem created successfully", problem });
    } catch (err) {
        console.error('Error creating problem:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createProblem };