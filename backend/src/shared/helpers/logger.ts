import { pino } from "pino";
import fs from "fs";

export class AppLogger {
  constructor() {}

  static createLogger(name: string): pino.Logger {
    const logStream = fs.createWriteStream("app.log", { flags: "a" }); // 'a' for append mode
    //  const logger = pino({ level: "debug", name }, logStream);
    const logger = pino({ level: "debug", name });
    return logger;
  }
}
