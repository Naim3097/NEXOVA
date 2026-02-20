import { z } from 'zod';

/**
 * Validation schemas for API endpoints using Zod
 * These schemas ensure type safety and data validation
 */

// Variation option schema
export const VariationOptionSchema = z.object({
  value: z.string().min(1).max(50),
  label: z.string().min(1).max(100),
  priceAdjustment: z.number().default(0),
  stock: z.number().int().min(0).default(0),
  colorCode: z.string().optional(),
});

// Variation schema
export const VariationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  type: z.enum(['size', 'color', 'other']),
  options: z.array(VariationOptionSchema).default([]),
});

// Product validation schemas
export const ProductCreateSchema = z.object({
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(255),
  description: z.string().max(5000).optional().nullable(),
  image_url: z
    .union([z.string().url(), z.literal('')])
    .optional()
    .nullable(),
  stock: z.number().int().min(0).default(0),
  base_price: z.number().positive(),
  currency: z.enum(['RM', 'MYR', 'USD', 'SGD', 'EUR', 'GBP']).default('RM'),
  quantity_pricing: z
    .array(
      z.object({
        min_qty: z.number().int().min(0),
        price: z.number().min(0),
      })
    )
    .default([]),
  variations: z.array(VariationSchema).default([]),
  notes: z.string().max(1000).optional().nullable(),
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

// Payment validation schemas
export const PaymentCreateSchema = z.object({
  projectId: z.string().uuid(),
  productName: z.string().min(1).max(255),
  productDescription: z.string().max(5000).optional(),
  amount: z.number().positive().max(1000000),
  currency: z.enum(['MYR', 'USD', 'SGD', 'EUR', 'GBP']),
  bankId: z.string().min(1, 'Bank selection is required'), // Silent Bill method
  hasBumpOffer: z.boolean().optional(),
  bumpOfferName: z.string().max(255).optional(),
  bumpOfferAmount: z.number().positive().max(100000).optional(),
  bumpOfferAccepted: z.boolean().optional(),
  customerEmail: z.string().email().optional(),
  customerName: z.string().min(1).max(255).optional(),
  customerPhone: z.string().max(20).optional(),
});

// Form submission validation
export const FormSubmissionSchema = z.object({
  project_id: z.string().uuid(),
  form_id: z.string().optional(),
  data: z.record(z.any()),
  metadata: z
    .object({
      user_agent: z.string().optional(),
      referrer: z.string().optional(),
    })
    .optional(),
});

// Analytics event validation
export const AnalyticsEventSchema = z.object({
  project_id: z.string().uuid(),
  event_type: z.enum([
    'page_view',
    'button_click',
    'form_view',
    'form_submit',
    'page_exit',
  ]),
  session_id: z.string().min(1),
  device_type: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

// Subscription validation
export const SubscriptionCreateSchema = z.object({
  plan: z.enum(['free', 'pro', 'enterprise']),
  billing_interval: z.enum(['monthly', 'yearly']),
  payment_method: z.object({
    card_number: z.string().length(16).regex(/^\d+$/),
    card_name: z.string().min(1).max(100),
    expiry_date: z.string().regex(/^\d{2}\/\d{2}$/),
    cvv: z.string().length(3).regex(/^\d+$/),
  }),
});

// Project validation
export const ProjectCreateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  template_id: z.string().uuid().optional(),
  domain: z.string().max(255).optional(),
});

export const ProjectUpdateSchema = ProjectCreateSchema.partial();

/**
 * Helper function to validate data against a schema
 * Returns validated data or throws validation error
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Safe validation that returns result instead of throwing
 */
export function safeValidateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: result.error };
}

/**
 * Format Zod errors for API responses
 */
export function formatValidationErrors(
  error: z.ZodError
): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join('.');
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(issue.message);
  }

  return formatted;
}
