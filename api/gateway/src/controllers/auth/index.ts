import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { authService } from '@gateway/services/auth';

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

  public async refreshToken(req: Request, res: Response): Promise<void> {
    const response = await authService.getRefreshToken(req.params.username);

    req.session = { jwt: response.data.token };
    res
      .status(StatusCodes.OK)
      .json({ message: response.data.message, user: response.data.user });
  }

  public async getCurrentUser(_req: Request, res: Response): Promise<void> {
    const response = await authService.getCurrentUser();

    res
      .status(StatusCodes.OK)
      .json({ message: response.data.message, user: response.data.user });
  }

  public async resendEmail(req: Request, res: Response): Promise<void> {
    const response = await authService.resendEmail(req.body);

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

  public async forgotPassword(req: Request, res: Response): Promise<void> {
    const response = await authService.forgotPassword(req.body.email);

    res.status(StatusCodes.OK).json({ message: response.data.message });
  }

  public async resetPassword(req: Request, res: Response): Promise<void> {
    const { password, confirmPassword } = req.body;
    const response = await authService.resetPassword(
      req.params.token,
      password,
      confirmPassword,
    );

    res.status(StatusCodes.OK).json({ message: response.data.message });
  }

  public async changePassword(req: Request, res: Response): Promise<void> {
    const { currentPassword, newPassword } = req.body;
    const response = await authService.changePassword(
      currentPassword,
      newPassword,
    );

    res.status(StatusCodes.OK).json({ message: response.data.message });
  }
}

export default AuthController;
