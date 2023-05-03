const mailjet = require("node-mailjet").apiConnect(
  process.env.MAILJET_APIKEY_PUBLIC,
  process.env.MAILJET_APIKEY_PRIVATE
);

module.exports = mailjet;
