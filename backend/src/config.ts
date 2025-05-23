import { AppError } from "#shared/middlewars/errorHandler.js";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

class Config {
  NODE_ENV?: string;
  DATABASE_URL?: string;
  HTTP_PORT?: string;
  HTTP_ADDRESS?: string;
  COOKIE_SECRET_ONE?: string;
  COOKIE_SECRET_TWO?: string;
  CLIENT_URL?: string;
  REDIS_URL?: string;

  constructor() {
    dotenv.config();
    this.NODE_ENV = process.env.NODE_ENV;
    this.DATABASE_URL = process.env.DATABASE_URL;
    this.HTTP_PORT = process.env.HTTP_PORT;
    this.HTTP_ADDRESS = process.env.HTTP_ADDRESS;
    this.COOKIE_SECRET_ONE = process.env.COOKIE_SECRET_ONE;
    this.COOKIE_SECRET_TWO = process.env.COOKIE_SECRET_TWO;
    this.CLIENT_URL = process.env.CLIENT_URL;
    this.REDIS_URL = process.env.REDIS_URL;
  }

  validateConfig() {
    for (const [key, value] of Object.entries(this)) {
      if (!value) {
        throw new AppError(`Missing environment variable: ${key}`, StatusCodes.INTERNAL_SERVER_ERROR);
      }
    }
  }
}

export const config = new Config();
