import { AppError } from "#shared/middlewars/errorHandler.js";
import { StatusCodes } from "http-status-codes";
import { ZodSchema, ZodError } from "zod";

export function zodValidation(schema: ZodSchema) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        const req = args[0];

        if (!req.body) {
          throw new AppError("Request body (JSON) is required", StatusCodes.BAD_REQUEST);
        }

        const parsedBody = await schema.parseAsync(req.body);
        req.body = parsedBody;
        return originalMethod.apply(this, args);
      } catch (error: any) {
        if (error instanceof ZodError) {
          const message = error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
          throw new AppError(`Validation failed: ${message}`, StatusCodes.BAD_REQUEST);
        }

        throw new AppError(`Validation failed: ${error.message}`, StatusCodes.BAD_REQUEST);
      }
    };

    return descriptor;
  };
}
