import mongoose from 'mongoose';

import {
  OrderMessage,
  RatingTypes,
  ReviewMessageDetails,
  SellerDocument,
} from '@francislagares/jobber-shared';

import { SellerModel } from '@users/models/seller';

import { updateBuyerIsSeller } from './buyer.service';

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

const createSeller = async (
  sellerData: SellerDocument,
): Promise<SellerDocument> => {
  const createdSeller: SellerDocument = (await SellerModel.create(
    sellerData,
  )) as SellerDocument;
  await updateBuyerIsSeller(`${createdSeller.email}`);

  return createdSeller;
};

const updateSeller = async (
  sellerId: string,
  sellerData: SellerDocument,
): Promise<SellerDocument> => {
  const updatedSeller: SellerDocument = (await SellerModel.findOneAndUpdate(
    { _id: sellerId },
    {
      $set: {
        profilePublicId: sellerData.profilePublicId,
        fullName: sellerData.fullName,
        profilePicture: sellerData.profilePicture,
        description: sellerData.description,
        country: sellerData.country,
        skills: sellerData.skills,
        oneliner: sellerData.oneliner,
        languages: sellerData.languages,
        responseTime: sellerData.responseTime,
        experience: sellerData.experience,
        education: sellerData.education,
        socialLinks: sellerData.socialLinks,
        certificates: sellerData.certificates,
      },
    },
    { new: true },
  ).exec()) as SellerDocument;

  return updatedSeller;
};

const updateTotalGigsCount = async (
  sellerId: string,
  count: number,
): Promise<void> => {
  await SellerModel.updateOne(
    { _id: sellerId },
    { $inc: { totalGigs: count } },
  ).exec();
};

const updateSellerOngoingJobs = async (
  sellerId: string,
  ongoingJobs: number,
): Promise<void> => {
  await SellerModel.updateOne(
    { _id: sellerId },
    { $inc: { ongoingJobs } },
  ).exec();
};

const updateSellerCancelledJobs = async (sellerId: string): Promise<void> => {
  await SellerModel.updateOne(
    { _id: sellerId },
    { $inc: { ongoingJobs: -1, cancelledJobs: 1 } },
  ).exec();
};

const updateSellerCompletedJobs = async (data: OrderMessage): Promise<void> => {
  const {
    sellerId,
    ongoingJobs,
    completedJobs,
    totalEarnings,
    recentDelivery,
  } = data;
  await SellerModel.updateOne(
    { _id: sellerId },
    {
      $inc: {
        ongoingJobs,
        completedJobs,
        totalEarnings,
      },
      $set: { recentDelivery: new Date(recentDelivery!) },
    },
  ).exec();
};

const updateSellerReview = async (
  data: ReviewMessageDetails,
): Promise<void> => {
  const ratingTypes: RatingTypes = {
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
  };
  const ratingKey: string = ratingTypes[`${data.rating}`];
  await SellerModel.updateOne(
    { _id: data.sellerId },
    {
      $inc: {
        ratingsCount: 1,
        ratingSum: data.rating,
        [`ratingCategories.${ratingKey}.value`]: data.rating,
        [`ratingCategories.${ratingKey}.count`]: 1,
      },
    },
  ).exec();
};

export {
  createSeller,
  getRandomSellers,
  getSellerByEmail,
  getSellerById,
  getSellerByUsername,
  updateSeller,
  updateSellerCancelledJobs,
  updateSellerCompletedJobs,
  updateSellerOngoingJobs,
  updateSellerReview,
  updateTotalGigsCount,
};
