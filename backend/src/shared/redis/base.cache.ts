import { config } from "#config.js";
import { AppLogger } from "#shared/helpers/logger.js";
import { createClient } from "redis";

export abstract class BaseCache {
  client: ReturnType<typeof createClient>;
  logger;

  constructor(cacheName: string) {
    this.logger = AppLogger.createLogger(cacheName);

    this.client = createClient({
      url: config.REDIS_URL || "redis://localhost:6379",
      commandOptions: { abortSignal: new AbortController().signal },
    });

    this.client.on("error", (err) => {
      this.logger.error("Redis Client Error", err);
    });
  }
}
