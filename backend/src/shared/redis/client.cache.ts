import { BaseCache } from "./base.cache.js";

export class CacheClient extends BaseCache {
  constructor() {
    super("CacheClient");
  }

  async connect() {
    try {
      await this.client.connect();
      this.logger.info("Redis client connected");
    } catch (error) {
      this.logger.error("Failed to connect to Redis", error);
    }
  }
}
