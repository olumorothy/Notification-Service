require("dotenv").config();
const { ERROR_MSG } = require("../../resources/constant");
const logger = require("../../resources/logs/logger");
const RegistrationEmailConsumer = require("./consumer");

RegistrationEmailConsumer().catch((err) => {
  logger.error(ERROR_MSG, err);
});
