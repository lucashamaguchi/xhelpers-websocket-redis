import { server } from "../index";

const redis = require("redis");

const connectionOptions = {
  url: process.env.REDIS_URI
}
export const subscriber = redis.createClient(connectionOptions);
export const publisher = redis.createClient(connectionOptions);

subscriber.on("subscribe", function(channel, count) {
  console.log(`[redis] subscribed to ${channel}`)
});

subscriber.on("message", function(channel, message) {
  console.log("Subscriber received message in channel '" + channel + "': " + message);
  server.publish(`/${channel}`, message);
  console.log(`[websocket] published to /${channel} message ${message}`)
});
