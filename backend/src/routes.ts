import { AuthRoutes } from "#features/auth/routes/auth.route.js";
import { container } from "#shared/libs/inversify.js";
import { ITypes } from "#shared/types/inversify.type.js";
import { Application, Router } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AppRoutes {
  private readonly path = "/api";
  private router: Router;

  constructor(@inject(ITypes.AuthRoutes) private readonly authRoutes: AuthRoutes) {
    this.router = Router();
  }

  public routes(): Router {
    this.router.use(this.path, this.authRoutes.routes());
    return this.router;
  }
}
