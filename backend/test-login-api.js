const axios = require('axios');

async function testLoginAPI() {
    const email = 'vijetachandel1709@gmail.com';
    const password = 'password123';
    const url = 'http://localhost:5000/api/auth/login';

    console.log(`Testing Login API: ${url}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

    try {
        const response = await axios.post(url, { email, password });
        console.log('SUCCESS: API returned status:', response.status);
        console.log('Response data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('FAIL: API returned error status:', error.response?.status);
        console.error('Error message:', error.response?.data?.message);
        console.error('Full response data:', JSON.stringify(error.response?.data, null, 2));
    }
}

testLoginAPI();
