const rabbit = require("./MessageBroker");

console.log("consumer3 : waiting message");

rabbit.getInstance().then((broker) => {
  broker.subscribeToExchange(
    "subscription.login",
    "consumer3.subscription.login",
    (msg, ack) => {
      console.log("Message:", msg.content.toString());
      ack();
    }
  );
});
