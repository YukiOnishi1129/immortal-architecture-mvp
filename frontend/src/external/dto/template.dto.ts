import { z } from "zod";

// Field schemas
export const FieldResponseSchema = z.object({
  id: z.uuid(),
  label: z.string(),
  order: z.number().int().positive(),
  isRequired: z.boolean(),
});

export const FieldInputSchema = z.object({
  label: z.string().min(1).max(100),
  order: z.number().int().positive(),
  isRequired: z.boolean(),
});

// Template schemas
export const TemplateResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  fields: z.array(FieldResponseSchema),
  updatedAt: z.iso.datetime(),
});

// Template detail schema (with owner info)
export const TemplateDetailResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  ownerId: z.string(),
  fields: z.array(FieldResponseSchema),
  updatedAt: z.iso.datetime(),
  createdAt: z.iso.datetime().optional(),
  isUsed: z.boolean().optional(),
});

export const CreateTemplateRequestSchema = z.object({
  name: z.string().min(1).max(100),
  fields: z.array(FieldInputSchema).min(1),
});

export const UpdateTemplateRequestSchema = z.object({
  name: z.string().min(1).max(100),
  fields: z
    .array(
      z.object({
        id: z.uuid().optional(),
        label: z.string().min(1).max(100),
        order: z.number().int().positive(),
        isRequired: z.boolean(),
      }),
    )
    .min(1),
});

// Type exports
export type FieldResponse = z.infer<typeof FieldResponseSchema>;
export type FieldInput = z.infer<typeof FieldInputSchema>;
export type TemplateResponse = z.infer<typeof TemplateResponseSchema>;
export type TemplateDetailResponse = z.infer<
  typeof TemplateDetailResponseSchema
>;
export type CreateTemplateRequest = z.infer<typeof CreateTemplateRequestSchema>;
export type UpdateTemplateRequest = z.infer<typeof UpdateTemplateRequestSchema>;
