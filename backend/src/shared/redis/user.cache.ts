import { injectable } from "inversify";
import { BaseCache } from "./base.cache.js";
import { User } from "#generated/prisma/index.js";
import { UserDTO } from "#features/auth/types/dto/user.dto.js";

@injectable()
export class UserCache extends BaseCache {
  constructor() {
    super("UserCache");
  }

  async connect() {
    try {
      await this.client.connect();
      this.logger.info("User cache connected successfully");
    } catch (error) {
      this.logger.error("Failed to connect to user cache", error);
      throw error;
    }
  }

  async setUser(key: string, userId: number, user: UserDTO) {
    try {
      await this.client.zAdd("user", { score: userId, value: key });

      /*  const redisUser: any = {
        ...user,
        updatedAt: user.updatedAt.toJSON(),
        createdAt: user.createdAt.toJSON(),
        profileImage: user.profileImage ?? "",
      };

      await this.client.hSet(`user:${key}`, redisUser); */
      await this.client.SETEX(`user:${key}`, 3600, JSON.stringify(user));
      this.logger.info(`User ${userId} cached successfully`);
    } catch (error) {
      this.logger.error(`Failed to cache user ${userId}`, error);
      throw error;
    }
  }

  async getUserById(userId: string) {
    try {
      const x = await this.client.hGetAll("users:key");
      return x;
      const user = await this.client.get(`user:${userId}`);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      this.logger.error(`Failed to get user by ID ${userId}`, error);
      throw error;
    }
  }

  async deleteUser(userId: string) {
    try {
      await this.client.del(`user:${userId}`);
      this.logger.info(`User ${userId} deleted from cache`);
    } catch (error) {
      this.logger.error(`Failed to delete user ${userId} from cache`, error);
      throw error;
    }
  }
}
/* function serializeForRedis(obj: Record<string, any>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      result[key] = "";
    } else if (typeof value === "object") {
      result[key] = JSON.stringify(value);
    } else {
      result[key] = String(value);
    }
  }
  return result;
} */
