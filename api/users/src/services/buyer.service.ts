import { BuyerDocument } from '@francislagares/jobber-shared';

import { BuyerModel } from '@users/models/buyer';

const getBuyerByEmail = async (
  email: string,
): Promise<BuyerDocument | null> => {
  const buyer: BuyerDocument | null = (await BuyerModel.findOne({
    email,
  }).exec()) as BuyerDocument;

  return buyer;
};

const getBuyerByUsername = async (
  username: string,
): Promise<BuyerDocument | null> => {
  const buyer: BuyerDocument | null = (await BuyerModel.findOne({
    username,
  }).exec()) as BuyerDocument;

  return buyer;
};

const getRandomBuyers = async (count: number): Promise<BuyerDocument[]> => {
  const buyers: BuyerDocument[] = await BuyerModel.aggregate([
    { $sample: { size: count } },
  ]);

  return buyers;
};

const createBuyer = async (buyerData: BuyerDocument): Promise<void> => {
  const buyerExists = await getBuyerByEmail(`${buyerData.email}`);

  if (!buyerExists) {
    await BuyerModel.create(buyerData);
  }
};

export { createBuyer, getBuyerByEmail, getBuyerByUsername, getRandomBuyers };
