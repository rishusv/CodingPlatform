const axios = require('axios');
const getLanguageById = (language) => {

    const languages = {
        'C++': 54,
        'java': 62,
        'javascript': 63
    };
    return languages[language.toLowerCase()] || null;
};

const submitBatch = async (submissions) => {

    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            base64_encoded: 'true'
        },
        headers: {
            'x-rapidapi-key': 'f370fc1bd7mshdb97e6cb47f3c0bp1c494ejsne5ddf41e65ac',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            submissions
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return await fetchData();
};

const submitToken = async (resultTokens) => {

    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            base64_encoded: 'true',
            tokens: resultTokens.join(','),
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': 'f370fc1bd7mshdb97e6cb47f3c0bp1c494ejsne5ddf41e65ac',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    while (true) {
        const result = await fetchData();

        const isResultObtained = result.submissions.every((r) => r.status_id > 2);

        if (isResultObtained) {
            return result.submissions;
        }

        await wait(1000); // Wait for 1 second before checking again
    }

    const waiting = async(timmer) => {
        setTimeout(() => {
            return 1;
        }, timmer);
    }

};

module.exports = { getLanguageById, submitBatch, submitToken };
