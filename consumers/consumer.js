const { Kafka } = require("kafkajs");
const { sendBorrowBookEmail } = require("../notifications/borrowedBookEmail");

const logger = require("../resources/logs/logger");
const {
  sendRegistrationOtp,
} = require("../notifications/userRegistrationemail");
const topic = "email";
const clientId = "lms-consumer";

const brokers = ["localhost:9092"];

const kafka = new Kafka({ clientId, brokers });

const consumer = kafka.consumer({ groupId: clientId });

const RegistrationEmailConsumer = async () => {
  try {
    await consumer.connect();
  } catch (connectionError) {
    logger.error("Error connecting to Kafka: ", connectionError);
  }

  try {
    await consumer.subscribe({ topic });
  } catch (subscriptionError) {
    logger.error("Error subscribing consumer: ", subscriptionError);
  }

  try {
    await consumer.run({
      eachMessage: ({ message }) => {
        const deserializedMessage = JSON.parse(message.value.toString());
        const { messageType } = deserializedMessage;

        if (messageType === "bookBorrowed") {
          const userData = deserializedMessage.userData;
          const bookData = deserializedMessage.bookData;
          const borrowedBookData = deserializedMessage.borrowedBook;
          sendBorrowBookEmail(userData, bookData, borrowedBookData);
        }
        if (messageType === "userSignup") {
          const firstname = deserializedMessage.firstname;
          const email = deserializedMessage.email;
          const otp = deserializedMessage.OTP;
          sendRegistrationOtp(email, firstname, otp);
        }
      },
    });
  } catch (consumerError) {
    logger.error("Error in reading messages: ", consumerError);
  }
};

module.exports = RegistrationEmailConsumer;
