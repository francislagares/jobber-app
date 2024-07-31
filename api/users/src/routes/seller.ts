import express, { Router } from 'express';

import { seller as createSeller } from '@users/controllers/seller/create';
import {
  getRandom,
  getSellerId,
  getSellerUsername,
} from '@users/controllers/seller/get';
import { seedSeller } from '@users/controllers/seller/seed';
import { seller as updateSeller } from '@users/controllers/seller/update';

const router: Router = express.Router();

export const sellerRoutes = (): Router => {
  router.get('/id/:sellerId', getSellerId);
  router.get('/username/:username', getSellerUsername);
  router.get('/random/:size', getRandom);
  router.post('/create', createSeller);
  router.put('/:sellerId', updateSeller);
  router.put('/seed/:count', seedSeller);

  return router;
};
