import { z } from 'zod';

const gigCreateSchema = z.object({
  sellerId: z.string({
    required_error: 'Seller Id is required',
    invalid_type_error: 'Seller Id must be of type string',
  }),
  profilePicture: z.string({
    required_error: 'Profile picture is required',
    invalid_type_error: 'Please add a profile picture',
  }),
  title: z.string({
    required_error: 'Gig title is required',
    invalid_type_error: 'Please add a gig title',
  }),
  description: z.string({
    required_error: 'Gig description is required',
    invalid_type_error: 'Please add a gig description',
  }),
  categories: z.string({
    required_error: 'Gig category is required',
    invalid_type_error: 'Please select a category',
  }),
  subCategories: z.array(z.string()).min(1, {
    message: 'Please add at least one subcategory',
  }),
  tags: z.array(z.string()).min(1, {
    message: 'Please add at least one tag',
  }),
  price: z
    .number({
      required_error: 'Gig price is required',
      invalid_type_error: 'Please add a gig price',
    })
    .gt(4.99, {
      message: 'Gig price must be greater than $4.99',
    }),
  coverImage: z.string({
    required_error: 'Gig cover image is required',
    invalid_type_error: 'Please add a cover image',
  }),
  expectedDelivery: z.string({
    required_error: 'Gig expected delivery is required',
    invalid_type_error: 'Please add expected delivery',
  }),
  basicTitle: z.string({
    required_error: 'Gig basic title is required',
    invalid_type_error: 'Please add basic title',
  }),
  basicDescription: z.string({
    required_error: 'Gig basic description is required',
    invalid_type_error: 'Please add basic description',
  }),
});

const gigUpdateSchema = z.object({
  title: z.string({
    required_error: 'Gig title is required',
    invalid_type_error: 'Please add a gig title',
  }),
  description: z.string({
    required_error: 'Gig description is required',
    invalid_type_error: 'Please add a gig description',
  }),
  categories: z.string({
    required_error: 'Gig category is required',
    invalid_type_error: 'Please select a category',
  }),
  subCategories: z.array(z.string()).min(1, {
    message: 'Please add at least one subcategory',
  }),
  tags: z.array(z.string()).min(1, {
    message: 'Please add at least one tag',
  }),
  price: z
    .number({
      required_error: 'Gig price is required',
      invalid_type_error: 'Please add a gig price',
    })
    .gt(4.99, {
      message: 'Gig price must be greater than $4.99',
    }),
  coverImage: z.string({
    required_error: 'Gig cover image is required',
    invalid_type_error: 'Please add a cover image',
  }),
  expectedDelivery: z.string({
    required_error: 'Gig expected delivery is required',
    invalid_type_error: 'Please add expected delivery',
  }),
  basicTitle: z.string({
    required_error: 'Gig basic title is required',
    invalid_type_error: 'Please add basic title',
  }),
  basicDescription: z.string({
    required_error: 'Gig basic description is required',
    invalid_type_error: 'Please add basic description',
  }),
});

export { gigCreateSchema, gigUpdateSchema };
