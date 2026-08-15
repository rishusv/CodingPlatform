const axios = require('axios');
const getLanguageById = (language) => {
    
    const languages = {
        'C++':54,
        'java':62,
        'javascript':63
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


module.exports = { getLanguageById, submitBatch };
