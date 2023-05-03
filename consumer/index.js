require("dotenv").config();
const { ERROR_MSG } = require("../resources/constant");
const logger = require("../resources/logs/logger");
const consume = require("./consumer");

consume().catch((err) => {
  logger.error(ERROR_MSG, err);
});
