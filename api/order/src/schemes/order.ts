import { z } from 'zod';

const orderSchema = z.object({
  offer: z
    .object({
      gigTitle: z.string({
        required_error: 'Gig title is required',
      }),
      price: z.number({
        required_error: 'Price is required',
      }),
      description: z.string({
        required_error: 'Description is required',
      }),
      deliveryInDays: z.number({
        required_error: 'Delivery days are required',
      }),
      oldDeliveryDate: z.string({
        required_error: 'Old delivery date is required',
      }),
      newDeliveryDate: z.string().optional(),
      accepted: z.boolean({
        required_error: 'Accepted status is required',
      }),
      cancelled: z.boolean({
        required_error: 'Cancelled status is required',
      }),
    })
    .required(),
  gigId: z.string({
    required_error: 'Gig ID is required',
  }),
  sellerId: z.string({
    required_error: 'Seller ID is required',
  }),
  sellerUsername: z.string({
    required_error: 'Seller username is required',
  }),
  sellerEmail: z.string({
    required_error: 'Seller email is required',
  }),
  sellerImage: z.string({
    required_error: 'Seller image is required',
  }),
  gigCoverImage: z.string({
    required_error: 'Gig cover image is required',
  }),
  gigMainTitle: z.string({
    required_error: 'Gig main title is required',
  }),
  gigBasicTitle: z.string({
    required_error: 'Gig basic title is required',
  }),
  gigBasicDescription: z.string({
    required_error: 'Gig basic description is required',
  }),
  buyerId: z.string({
    required_error: 'Buyer ID is required',
  }),
  buyerUsername: z.string({
    required_error: 'Buyer username is required',
  }),
  buyerEmail: z.string({
    required_error: 'Buyer email is required',
  }),
  buyerImage: z.string({
    required_error: 'Buyer image is required',
  }),
  status: z.string({
    required_error: 'Status is required',
  }),
  orderId: z.string({
    required_error: 'Order ID is required',
  }),
  invoiceId: z.string({
    required_error: 'Invoice ID is required',
  }),
  quantity: z.number({
    required_error: 'Quantity is required',
  }),
  price: z.number({
    required_error: 'Price is required',
  }),
  serviceFee: z.number().optional(),
  requirements: z.string().optional().nullable(),
  paymentIntent: z.string({
    required_error: 'Payment intent is required',
  }),
  requestExtension: z
    .object({
      originalDate: z.string({
        required_error: 'Original date is required',
      }),
      newDate: z.string({
        required_error: 'New date is required',
      }),
      days: z.number({
        required_error: 'Number of days is required',
      }),
      reason: z.string({
        required_error: 'Reason is required',
      }),
    })
    .optional(),
  delivered: z.boolean().optional(),
  approvedAt: z.string().optional(),
  deliveredWork: z
    .array(
      z.object({
        message: z.string().optional(),
        file: z.string().optional(),
      }),
    )
    .optional(),
  dateOrdered: z.string().optional(),
  events: z
    .object({
      placeOrder: z.string().optional(),
      requirements: z.string().optional(),
      orderStarted: z.string().optional(),
      deliverydateUpdate: z.string().optional(),
      orderDelivered: z.string().optional(),
      buyerReview: z.string().optional(),
      sellerReview: z.string().optional(),
    })
    .optional(),
  buyerReview: z
    .object({
      rating: z.number().optional(),
      review: z.string().optional(),
    })
    .optional(),
  sellerReview: z
    .object({
      rating: z.number().optional(),
      review: z.string().optional(),
    })
    .optional(),
});

const orderUpdateSchema = z.object({
  originalDate: z.string({
    required_error: 'Original date is required',
  }),
  newDate: z.string({
    required_error: 'New date is required',
  }),
  days: z.number({
    required_error: 'Number of days is required',
  }),
  reason: z.string({
    required_error: 'Reason is required',
  }),
  deliveryDateUpdate: z.string().optional(),
});

export { orderSchema, orderUpdateSchema };
