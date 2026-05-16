import mongoose, { Schema, Document } from 'mongoose';

interface IRefreshToken {
  tokenHash: string;
  createdAt: Date;
  expiresAt: Date;
  userAgent?: string;
}

interface IBusinessAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshTokens: IRefreshToken[];
  failedLoginAttempts: number;
  lockedUntil?: Date;
  plan: 'free' | 'pro' | 'business';
  planExpiresAt?: Date;
  businessName?: string;
  businessAddress?: IBusinessAddress;
  businessPhone?: string;
  businessEmail?: string;
  businessWebsite?: string;
  logoUrl?: string;
  defaultCurrency: string;
  defaultTaxRate: number;
  defaultPaymentTerms: number;
  defaultNotes?: string;
  invoicePrefix: string;
  invoiceCounter: number;
  defaultTemplate: string;
  accentColor: string;
  themeMode: 'light' | 'dark' | 'system';
  colorTheme: string;
  customThemeColors?: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    input: string;
    ring: string;
  };
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
  tokenHash: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  expiresAt: { type: Date, required: true },
  userAgent: { type: String },
});

const businessAddressSchema = new Schema<IBusinessAddress>({
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
});

const customThemeColorsSchema = new Schema({
  primary: { type: String, required: true },
  primaryForeground: { type: String, required: true },
  secondary: { type: String, required: true },
  accent: { type: String, required: true },
  background: { type: String, required: true },
  foreground: { type: String, required: true },
  muted: { type: String, required: true },
  mutedForeground: { type: String, required: true },
  border: { type: String, required: true },
  input: { type: String, required: true },
  ring: { type: String, required: true },
});

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    refreshTokens: [refreshTokenSchema],
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date },
    plan: { type: String, enum: ['free', 'pro', 'business'], default: 'free' },
    planExpiresAt: { type: Date },
    businessName: { type: String },
    businessAddress: businessAddressSchema,
    businessPhone: { type: String },
    businessEmail: { type: String },
    businessWebsite: { type: String },
    logoUrl: { type: String },
    defaultCurrency: { type: String, default: 'USD' },
    defaultTaxRate: { type: Number, default: 0 },
    defaultPaymentTerms: { type: Number, default: 30 },
    defaultNotes: { type: String },
    invoicePrefix: { type: String, default: 'INV' },
    invoiceCounter: { type: Number, default: 0 },
    defaultTemplate: { type: String, default: 'classic' },
    accentColor: { type: String, default: '#1D1E22' },
    themeMode: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' },
    colorTheme: { type: String, default: 'slate' },
    customThemeColors: customThemeColorsSchema,
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.index({ isDeleted: 1 });

export const User = mongoose.model<IUser>('User', userSchema);