const amqp = require("amqplib");
const express = require("express");
const rabbit = require("./MessageBroker");

const app = express();

app.use(express.json({ extended: false }));

const url = "amqp://root:wahyu123@localhost";

app.post("/", async (req, res) => {
  const connection = await amqp.connect(url);
  const { payload } = req.body;
  try {
    const channel = await connection.createChannel();
    const exchange = "subscription.login";
    const message = JSON.stringify(payload);

    channel.assertExchange(exchange, "fanout", { durable: true });
    channel.publish(exchange, "", Buffer.from(message));

    console.log("send message : ", message);

    res.send({ message: "publish message to subscription.login exchange" });
  } catch (error) {
    console.log(error);
    res.send({ message: error.message });
  }
});

app.post("/broadcast", async (req, res) => {
  try {
    const exchange = "subscription.login";
    const { payload } = req.body;

    const broker = await rabbit.getInstance();
    const message = JSON.stringify(payload);

    await broker.broadcast(exchange, message);

    res.send({ message: "broadcast message to :", exchange, message });
  } catch (error) {
    console.log(error);
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
