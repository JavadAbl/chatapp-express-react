import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { inject, injectable } from "inversify";
import { ITypes } from "#shared/types/inversify.type.js";

@injectable()
export class AuthRoutes {
  private readonly path = "/auth";
  private router: Router;

  constructor(@inject(ITypes.AuthController) private readonly authController: AuthController) {
    this.router = Router();
  }

  public routes(): Router {
    this.router.post(`${this.path}/register`, (req, res) => this.authController.register(req, res));
    return this.router;
  }
}
