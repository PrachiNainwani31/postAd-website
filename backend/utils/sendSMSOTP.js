const axios = require('axios');

const sendSMSOTP = async (phone, otp) => {
  const url = `https://www.fast2sms.com/dev/bulkV2`;
  await axios.post(
    url,
    {
      variables_values: otp,
      route: "otp",
      numbers: phone
    },
    {
      headers: {
        authorization: process.env.FAST2SMS_API_KEY
      }
    }
  );
};

module.exports = sendSMSOTP;
