import mongoose from 'mongoose';

import { SellerDocument } from '@francislagares/jobber-shared';

import { SellerModel } from '@users/models/seller';

const getSellerById = async (
  sellerId: string,
): Promise<SellerDocument | null> => {
  const seller: SellerDocument | null = (await SellerModel.findOne({
    _id: new mongoose.Types.ObjectId(sellerId),
  }).exec()) as SellerDocument;
  return seller;
};

const getSellerByUsername = async (
  username: string,
): Promise<SellerDocument | null> => {
  const seller: SellerDocument | null = (await SellerModel.findOne({
    username,
  }).exec()) as SellerDocument;
  return seller;
};

const getSellerByEmail = async (
  email: string,
): Promise<SellerDocument | null> => {
  const seller: SellerDocument | null = (await SellerModel.findOne({
    email,
  }).exec()) as SellerDocument;
  return seller;
};

const getRandomSellers = async (size: number): Promise<SellerDocument[]> => {
  const sellers: SellerDocument[] = await SellerModel.aggregate([
    { $sample: { size } },
  ]);
  return sellers;
};

export {
  getRandomSellers,
  getSellerByEmail,
  getSellerById,
  getSellerByUsername,
};
