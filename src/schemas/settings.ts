import { z } from 'zod';

export const settingsSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  speedLimitAlert: z.coerce.number().min(30).max(200),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
