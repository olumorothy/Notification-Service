const { Kafka } = require("kafkajs");

const {
  sendRegistrationOtp,
} = require("../../notifications/userRegistrationemail");
const logger = require("../../resources/logs/logger");

const clientId = "lms-consumer";

const brokers = ["localhost:9092"];
const topic = "otp";
const kafka = new Kafka({ clientId, brokers });

const consumer = kafka.consumer({ groupId: clientId });

const otpConsumer = async () => {
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
        const firstname = deserializedMessage.firstname;
        const email = deserializedMessage.email;
        const otp = deserializedMessage.OTP;
        sendRegistrationOtp(email, firstname, otp);
      },
    });
  } catch (consumerError) {
    logger.error("Error in reading messages: ", consumerError);
  }
};

module.exports = otpConsumer;
