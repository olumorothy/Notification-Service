require("dotenv").config();
const { ERROR_MSG } = require("../../resources/constant");
const logger = require("../../resources/logs/logger");
const otpConsumer = require("./otpConsumer");

otpConsumer().catch((err) => {
  logger.error(ERROR_MSG, err);
});
