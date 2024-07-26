import { z } from 'zod';

export const sellerSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  fullName: z
    .string({
      required_error: 'Fullname is a required field',
      invalid_type_error: 'Fullname must be of type string',
    })
    .min(1),
  username: z.string().optional(),
  email: z.string().optional(),
  profilePublicId: z.string().nullable().optional(),
  profilePicture: z
    .string({
      required_error: 'Please add profile picture',
    })
    .min(1),
  description: z
    .string({
      required_error: 'Please add a seller description',
    })
    .min(1),
  country: z
    .string({
      required_error: 'Please select a country',
    })
    .min(1),
  oneliner: z
    .string({
      required_error: 'Please add your oneliner',
    })
    .min(1),
  skills: z
    .array(
      z.string({
        required_error: 'Please add at least one skill',
      }),
    )
    .min(1),
  languages: z
    .array(
      z.object({
        _id: z.string().optional(),
        language: z.string(),
        level: z.string(),
      }),
      {
        required_error: 'Please add at least one language',
      },
    )
    .min(1),
  responseTime: z
    .number({
      required_error: 'Response time must be greater than zero',
    })
    .min(1),
  experience: z
    .array(
      z.object({
        _id: z.string().optional(),
        company: z.string(),
        title: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        description: z.string(),
        currentlyWorkingHere: z.boolean(),
      }),
      {
        required_error: 'Please add at least one work experience',
      },
    )
    .min(1),
  education: z
    .array(
      z.object({
        _id: z.string().optional(),
        country: z.string(),
        university: z.string(),
        title: z.string(),
        major: z.string(),
        year: z.string(),
      }),
      {
        required_error: 'Please add at least one education',
      },
    )
    .min(1),
  socialLinks: z.array(z.string()).nullable().optional(),
  certificates: z
    .array(
      z.object({
        _id: z.string().optional(),
        name: z.string(),
        from: z.string(),
        year: z.number(),
      }),
    )
    .nullable()
    .optional(),
  ratingsCount: z.number().optional(),
  ratingCategories: z
    .object({
      five: z.object({ value: z.number(), count: z.number() }).optional(),
      four: z.object({ value: z.number(), count: z.number() }).optional(),
      three: z.object({ value: z.number(), count: z.number() }).optional(),
      two: z.object({ value: z.number(), count: z.number() }).optional(),
      one: z.object({ value: z.number(), count: z.number() }).optional(),
    })
    .optional(),
  ratingSum: z.number().optional(),
  recentDelivery: z.string().nullable().optional(),
  ongoingJobs: z.number().optional(),
  completedJobs: z.number().optional(),
  cancelledJobs: z.number().optional(),
  totalEarnings: z.number().optional(),
  totalGigs: z.number().optional(),
  createdAt: z.string().nullable().optional(),
});
