import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { gigService } from '@gateway/services/gig';

export class Search {
  public async gigs(req: Request, res: Response): Promise<void> {
    const { from, size, type } = req.params;
    let query = '';
    const objList = Object.entries(req.query);
    const lastItemIndex = objList.length - 1;

    objList.forEach(([key, value], index) => {
      query += `${key}=${value}${index !== lastItemIndex ? '&' : ''}`;
    });

    const response: AxiosResponse = await gigService.getGigs(
      `${query}`,
      from,
      size,
      type,
    );

    res.status(StatusCodes.OK).json({
      message: response.data.message,
      total: response.data.total,
      gigs: response.data.gigs,
    });
  }

  public async gigById(req: Request, res: Response): Promise<void> {
    const response = await gigService.getGig(req.params.gigId);

    res
      .status(StatusCodes.OK)
      .json({ message: response.data.message, gig: response.data.gig });
  }
}
