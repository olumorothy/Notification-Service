const pug = require("pug");
const mailjet = require("../resources/mailjet");
const logger = require("../resources/logs/logger");
const { ERROR_MSG } = require("../resources/constant");

async function sendRegistrationOtp(email, firstname, otp) {
  const otpEmailTemplate = pug.compileFile("templates/registrationOtp.pug");

  const mail = otpEmailTemplate({ name: firstname, otp: otp });

  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: process.env.FROM_EMAIL,
          Name: process.env.FROM_NAME,
        },
        To: [
          {
            Email: email,
            Name: firstname,
          },
        ],
        Subject: "Account Activation OTP",
        TextPart: "",
        HTMLPart: mail,
      },
    ],
  });
  try {
    await request;
  } catch (err) {
    logger.error(ERROR_MSG, err);
  }
}
module.exports = { sendRegistrationOtp };
