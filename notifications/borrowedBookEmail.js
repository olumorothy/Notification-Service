const pug = require("pug");
const { cloudinary } = require("../resources/cloudinary");
const mailjet = require("../resources/mailjet");
const logger = require("../resources/logs/logger");
const { ERROR_MSG } = require("../resources/constant");

async function sendBorrowBookEmail(userData, bookData, borrowedBookData) {
  const borrowedBookEmailTemplate = pug.compileFile(
    "templates/borrowBookEMail.pug"
  );
  const mail = borrowedBookEmailTemplate({
    userInfo: userData,
    book: bookData,
    borrow: borrowedBookData,
    headerImg: cloudinary.url("Order_confirmation_pvxoua"),
    footerImg: cloudinary.url("footer_ptpzrv"),
  });

  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: process.env.FROM_EMAIL,
          Name: process.env.FROM_NAME,
        },
        To: [
          {
            EMail: userData.email,
            Name: userData.firstname,
          },
        ],
        Subject: "Book Order Confirmation",
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

module.exports = { sendBorrowBookEmail };
