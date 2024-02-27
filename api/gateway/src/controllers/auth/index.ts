import { authService } from '@gateway/services/auth';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class AuthController {
  public async signUp(req: Request, res: Response): Promise<void> {
    const response = await authService.signUp(req.body);
    req.session = { jwt: response.data.token };
    res
      .status(StatusCodes.CREATED)
      .json({ message: response.data.message, user: response.data.user });
  }

  public async signIn(req: Request, res: Response): Promise<void> {
    const response = await authService.signIn(req.body);
    req.session = { jwt: response.data.token };
    res
      .status(StatusCodes.OK)
      .json({ message: response.data.message, user: response.data.user });
  }

  public async verifyEmail(req: Request, res: Response): Promise<void> {
    const response = await authService.verifyEmail(req.body.token);

    res
      .status(StatusCodes.OK)
      .send({ message: response.data.message, user: response.data.user });
  }
}

export default AuthController;
