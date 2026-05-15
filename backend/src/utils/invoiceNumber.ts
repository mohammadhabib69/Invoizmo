import { customAlphabet } from 'nanoid';

// Using a custom alphabet for cleaner invoice numbers
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 10);

export const generateInvoiceNumber = (prefix: string = 'INV'): string => {
  return `${prefix}-${nanoid()}`;
};