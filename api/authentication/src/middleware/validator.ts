import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AnyZodObject, ZodError, ZodIssue } from 'zod';

export const validateRequest = (validator: AnyZodObject) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<Error>> => {
    try {
      await validator.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: ZodIssue) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }));

        return res
          .status(StatusCodes.BAD_REQUEST)
          .send({ error: 'Invalid data', details: errorMessages });
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: 'Internal Server Error' });
    }
  };
};
