import mongoose, { Model, Schema, model } from 'mongoose';

import { BuyerDocument } from '@francislagares/jobber-shared';

const buyerSchema: Schema = new Schema(
  {
    username: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    profilePicture: { type: String, required: true },
    country: { type: String, required: true },
    isSeller: { type: Boolean, default: false },
    purchasedGigs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }],
    createdAt: { type: Date },
  },
  {
    versionKey: false,
  },
);

const BuyerModel: Model<BuyerDocument> = model<BuyerDocument>(
  'Buyer',
  buyerSchema,
  'Buyer',
);
export { BuyerModel };
