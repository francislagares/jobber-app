import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class HealthController {
  public getHealth = async (_req: Request, res: Response): Promise<void> => {
    try {
      res
        .status(StatusCodes.OK)
        .send({ health: 'API Gateway service is healthy and OK!' });
    } catch (e) {
      if (e instanceof Error) {
        res.status(500).send(e.message);
      }
    }
  };
}

export default HealthController;
