import { Model, Schema, model } from 'mongoose';

import { ConversationDocument } from '@francislagares/jobber-shared';

const conversationSchema: Schema = new Schema({
  conversationId: { type: String, required: true, unique: true, index: true },
  senderUsername: { type: String, required: true, index: true },
  receiverUsername: { type: String, required: true, index: true },
});

export const ConversationModel: Model<ConversationDocument> =
  model<ConversationDocument>(
    'Conversation',
    conversationSchema,
    'Conversation',
  );
