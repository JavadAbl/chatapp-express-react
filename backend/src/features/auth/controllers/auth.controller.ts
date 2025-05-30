import { Request, Response } from "express";
import { AuthServiceInterface } from "../types/auth-service.type.js";
import { RegisterDTO, RegisterScheme } from "../schemes/register.scheme.js";
import { inject, injectable } from "inversify";
import { ITypes } from "#shared/types/inversify.type.js";
import { zodValidation } from "#shared/decorators/zod-validation.decorator.js";
import { StatusCodes } from "http-status-codes";

@injectable()
export class AuthController {
  constructor(@inject(ITypes.AuthService) private readonly authService: AuthServiceInterface) {}

  //Register-------------------------------------------------------------------------
  @zodValidation(RegisterScheme)
  public async register(req: Request<unknown, unknown, RegisterDTO>, res: Response) {
    const newUser = await this.authService.register(req.body);

    res.status(StatusCodes.CREATED).json(newUser);
  }
}
