import { AuthController } from "#features/auth/controllers/auth.controller.js";
import { Container } from "inversify";
import { ITypes } from "../types/inversify.type.js";
import { AuthServiceInterface } from "#features/auth/types/auth-service.type.js";
import { AuthService } from "#features/auth/services/auth.service.js";
import { PrismaClient } from "#generated/prisma/index.js";
import { AuthRoutes } from "#features/auth/routes/auth.route.js";
import { AppRoutes } from "#routes.js";

const container = new Container();

// Bind controller
container.bind<AuthController>(ITypes.AuthController).to(AuthController).inSingletonScope();

// Bind interface to implementation
container.bind<AuthServiceInterface>(ITypes.AuthService).to(AuthService).inSingletonScope();

// Bind Routes
container.bind<AppRoutes>(ITypes.AppRoutes).to(AppRoutes).inSingletonScope();
container.bind<AuthRoutes>(ITypes.AuthRoutes).to(AuthRoutes).inSingletonScope();

container.bind<PrismaClient>(ITypes.PrismaClient).toConstantValue(new PrismaClient());

// container.bind<() => PrismaClient>(ITypes.PrismaClient).toFactory(() => () => new PrismaClient());

export { container };
