import "reflect-metadata";
import { databaseConnection } from "#database.js";
import { AppServer } from "#server.js";
import express from "express";
import { config } from "#config.js";

function main() {
  console.log("start");

  config.validateConfig();

  databaseConnection();

  const app = express();
  const appServer = new AppServer(app);
  appServer.start();
  console.log("end");
}

main();
