const axios = require('axios');

const sendSMSOTP = async (phone, otp) => {
  try {
    const response = await axios.post(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        route: 'v3',
        sender_id: 'FSTSMS',
        message: `Your OTP is ${otp}`,
        language: 'english',
        flash: 0,
        numbers: phone,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,  // keep in .env
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('SMS sent:', response.data);
  } catch (err) {
    console.error('Error sending SMS:', err.response?.data || err.message);
  }
};

module.exports = sendSMSOTP;
