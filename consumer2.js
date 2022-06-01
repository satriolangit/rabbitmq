const amqp = require("amqplib");

async function consume() {
  try {
    console.log("consumer2 : waiting message");
    const url = "amqp://root:wahyu123@localhost";
    const connection = await amqp.connect(url);

    const channel = await connection.createChannel();
    const exchange = "subscription.login";
    const queue = "consumer2.subscription.login";

    await channel.assertExchange(exchange, "fanout", { durable: true });
    await channel.assertQueue(queue, { exclusive: false });
    await channel.bindQueue(queue, exchange, "");
    await channel.consume(
      queue,
      (message) => {
        if (message.content) {
          console.log("receiving message : ", message.content.toString());
          channel.ack(message);
        }
      },
      true
    );
  } catch (error) {
    console.log(error);
  }
}

consume();
