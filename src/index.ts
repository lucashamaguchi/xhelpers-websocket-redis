// tslint:disable-next-line: no-var-requires
require("dotenv").config();

import { createServer } from "xhelpers-api/lib/server";
import * as Nes from "@hapi/nes";
import { subscriber } from "./model/redis_channel"
// tslint:disable-next-line: no-var-requires
const pkgJson = require("../package.json");

export let server: any;
const options: any = {
  serverOptions: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || "127.0.0.1",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  },
  options: {
    jwt_secret: process.env.JWT_SECRET,
    swaggerOptions: {
      info: {
        title: pkgJson.name,
        version: pkgJson.version,
      },
      schemes: [process.env.SSL === "true" ? "https" : "http"],
      grouping: "tags",
    },
    routeOptions: {
      routes: "*/routes/*.js",
    },
  },
};

export async function getServer(){
  let serverAux: any = {};
  serverAux = await createServer(options);

  // register Nes
  await serverAux.register({
    plugin: Nes,
    options: {
      auth: {
        type: "token"
      }
    }
  });

  // subscription filter
  const subscriptionFilter = async (path, message, opt) => {
    return true;
  };

  const onSubscribe = async (socket, path, params) => {
    subscriber.subscribe(params.channel);
    console.log(`subscribed to ${params.channel}`)
    return;
  }

  const onUnsubscribe = async (socket, path, params) => {
    subscriber.unsubscribe(params.channel);
    console.log(`unsubscribed to ${params.channel}`)
    return;
  }

  // add subscriptions
  serverAux.subscription("/{channel}", {
    auth: false,
    filter: subscriptionFilter,
    onSubscribe,
    onUnsubscribe,
  });
  serverAux.subscription("/{channel}/{subchannel}", {
    auth: false,
    filter: subscriptionFilter
  });
  serverAux.subscription("/{channel}/{subchannel}/{action}", {
    auth: false,
    filter: subscriptionFilter,
  });

  return serverAux;
}

async function start() {
  server = await getServer();
  await server.start();
  return server;
}

if (typeof require !== "undefined" && require.main === module) {
  start();
}
