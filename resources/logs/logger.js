const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

const logger = createLogger({
  level: "debug",
  format: combine(
    label({ label: CATEGORY }),
    timestamp({ format: "MM-DD-YYYY HH:mm:ss" }),
    prettyPrint()
  ),
  transports: [
    new transports.File({ filename: "logs/info.log" }),
    new transports.File({ level: "error", filename: "logs/error.log" }),
    new transports.Console(),
  ],
});

module.exports = logger;
