import { z } from 'zod';

export const messageSchema = z.object({
  conversationId: z.string().optional().nullable(),
  _id: z.string().optional(),
  body: z.string().optional().nullable(),
  hasConversationId: z.boolean().optional(), // this is only for checking if conversation id exists
  file: z.string().optional().nullable(),
  fileType: z.string().optional().nullable(),
  fileName: z.string().optional().nullable(),
  fileSize: z.string().optional().nullable(),
  gigId: z.string().optional().nullable(),
  sellerId: z.string({
    required_error: 'Seller id is required',
    invalid_type_error: 'Seller id must be of type string',
  }),
  buyerId: z.string({
    required_error: 'Buyer id is required',
    invalid_type_error: 'Buyer id must be of type string',
  }),
  senderUsername: z.string({
    required_error: 'Sender username is required',
    invalid_type_error: 'Sender username must be of type string',
  }),
  senderPicture: z.string({
    required_error: 'Sender picture is required',
    invalid_type_error: 'Sender picture must be of type string',
  }),
  receiverUsername: z.string({
    required_error: 'Receiver username is required',
    invalid_type_error: 'Receiver username must be of type string',
  }),
  receiverPicture: z.string({
    required_error: 'Receiver picture is required',
    invalid_type_error: 'Receiver picture must be of type string',
  }),
  isRead: z.boolean().optional(),
  hasOffer: z.boolean().optional(),
  offer: z
    .object({
      gigTitle: z.string().optional(),
      price: z.number().optional(),
      description: z.string().optional(),
      deliveryInDays: z.number().optional(),
      oldDeliveryDate: z.string().optional(),
      newDeliveryDate: z.string().optional(),
      accepted: z.boolean().optional(),
      cancelled: z.boolean().optional(),
    })
    .optional(),
  createdAt: z.string().optional(),
});
