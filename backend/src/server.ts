import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import cookieSession from "cookie-session";
import compression from "compression";
import http from "http";
import { config } from "#config.js";
import { Server as SocketServer } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { AppRoutes } from "#routes.js";
import { errorHandler } from "#shared/middlewars/errorHandler.js";
import { AppLogger } from "#shared/helpers/logger.js";
import { ITypes } from "#shared/types/inversify.type.js";
import { container } from "#shared/libs/inversify.js";
import { StatusCodes } from "http-status-codes";

const logger = AppLogger.createLogger("Server");

export class AppServer {
  constructor(private readonly app: Application) {}

  public start(): void {
    this.setupSecurityMiddlewares(this.app);
    this.setupStandardMiddlewares(this.app);
    this.setupRoutesMiddlewares(this.app);
    this.setupErrorHandler(this.app);
    this.setupServers(this.app);
  }

  //--------------------------------------------------------------------------------
  private setupServers(app: Application) {
    try {
      const httpServer = this.setupHttpServer(app);

      this.setupSocketIOServer(httpServer);
    } catch (error) {
      logger.error(error);
    }
  }

  //--------------------------------------------------------------------------------
  private setupSecurityMiddlewares(app: Application): void {
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      }),
    );
    app.use(
      cookieSession({
        name: "session",
        keys: [config.COOKIE_SECRET_ONE!, config.COOKIE_SECRET_TWO!],
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true, // Set to true to make the cookie inaccessible via JavaScript
        secure: config.NODE_ENV! !== "Development", // Set to true if using HTTPS
      }),
    );
    app.use(helmet());
    app.use(hpp());
  }

  //--------------------------------------------------------------------------------
  private setupStandardMiddlewares(app: Application): void {
    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static("public"));
    // app.use("/ProfileImages", express.static(join(__dirname, "profile-images")));
  }

  //--------------------------------------------------------------------------------
  private setupRoutesMiddlewares(app: Application): void {
    const appRoutes = container.get<AppRoutes>(ITypes.AppRoutes);
    app.use(appRoutes.routes());
  }

  //--------------------------------------------------------------------------------
  private setupErrorHandler(app: Application): void {
    app.all("/{*any}", (req, res) => {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Not found" });
    });

    app.use(errorHandler);
  }

  //--------------------------------------------------------------------------------
  private setupHttpServer(app: Application): http.Server {
    const httpServer = http.createServer(app);

    httpServer.listen(config.HTTP_PORT, () => {
      logger.info(`Server started on process ${process.pid}`);
      logger.info("Server running on port " + config.HTTP_PORT);
    });

    return httpServer;
  }

  //--------------------------------------------------------------------------------
  private async setupSocketIOServer(httpServer: http.Server): Promise<SocketServer> {
    const io = new SocketServer(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        credentials: true,
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      },
    });

    const pubClient = createClient({ url: config.REDIS_URL });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    io.adapter(createAdapter(pubClient, subClient));

    return io;
  }
}
