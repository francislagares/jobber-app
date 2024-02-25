import { authService } from '@gateway/services/auth';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class AuthController {
  public async create(req: Request, res: Response): Promise<void> {
    const response = await authService.signUp(req.body);
    req.session = { jwt: response.data.token };
    res
      .status(StatusCodes.CREATED)
      .json({ message: response.data.message, user: response.data.user });
  }
}

export default AuthController;
