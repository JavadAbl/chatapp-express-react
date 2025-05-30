import { PrismaClient } from "#generated/prisma/index.js";
import { AppLogger } from "#shared/helpers/logger.js";
import { container } from "#shared/libs/inversify.js";
import { CacheClient } from "#shared/redis/client.cache.js";
import { ITypes } from "#shared/types/inversify.type.js";

const logger = AppLogger.createLogger("Database");
const prisma = container.get<PrismaClient>(ITypes.PrismaClient);
const userCache = container.get<CacheClient>(ITypes.UserCache);

export function databaseConnection() {
  prisma
    .$connect()
    .then(() => {
      logger.info("Connected to SQL database with Prisma");

      userCache.connect();
    })
    .catch((error) => {
      logger.error("Failed to connect to SQL database", error);
      process.exit(1);
    });

  // Optional: handle disconnection
  process.on("exit", async () => {
    await prisma.$disconnect();
    logger.info("Disconnected from SQL database");
  });
}
