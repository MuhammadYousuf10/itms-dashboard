import { z } from 'zod';

export const settingsSchema = z.object({
  // Profile
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),

  // Security
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
  twoFactorAuth: z.boolean().default(false),

  // Notifications
  emailAlerts: z.boolean().default(true),
  smsAlerts: z.boolean().default(false),
  weeklyReport: z.boolean().default(true),

  // Preferences
  speedLimitAlert: z.coerce.number().min(30).max(200),
  refreshInterval: z.enum(['30', '60', '300']).default('30'),
  defaultLocation: z.string().default('New York'),
}).superRefine((data, ctx) => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirmPassword'],
      message: 'Passwords do not match',
    });
  }
  if (data.newPassword && !data.currentPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['currentPassword'],
      message: 'Current password is required to set a new password',
    });
  }
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
