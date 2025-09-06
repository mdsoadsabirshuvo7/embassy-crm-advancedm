import * as z from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const phoneSchema = z.string().min(10, 'Phone must be at least 10 characters');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');

// Client validation schema
export const clientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  phone: phoneSchema,
  address: z.string().min(5, 'Address must be at least 5 characters'),
  nationality: z.string().min(2, 'Nationality is required'),
  passportNumber: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']),
  assignedTo: z.string().min(1, 'Must assign to someone'),
  notes: z.string().optional(),
  company: z.string().optional(),
  visaType: z.string().optional(),
});

// Expense validation schema
export const expenseSchema = z.object({
  description: z.string().min(3, 'Description must be at least 3 characters'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.enum(['BDT', 'USD']),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  paymentMethod: z.enum(['cash', 'card', 'bank_transfer', 'cheque']),
  vendor: z.string().min(2, 'Vendor name is required'),
  receipt: z.string().optional(),
  project: z.string().optional(),
  billable: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

// Employee validation schema
export const employeeSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  employeeId: z.string().min(1, 'Employee ID is required'),
  department: z.string().min(1, 'Department is required'),
  position: z.string().min(1, 'Position is required'),
  salary: z.number().positive('Salary must be positive'),
  currency: z.enum(['BDT', 'USD']),
  hireDate: z.date(),
  status: z.enum(['active', 'inactive', 'terminated']),
  bankAccount: z.string().optional(),
  benefits: z.array(z.string()).default([]),
});

// Invoice validation schema
export const invoiceSchema = z.object({
  number: z.string().min(1, 'Invoice number is required'),
  clientId: z.string().min(1, 'Client is required'),
  issueDate: z.date(),
  dueDate: z.date(),
  items: z.array(z.object({
    description: z.string().min(1, 'Item description is required'),
    quantity: z.number().positive('Quantity must be positive'),
    rate: z.number().positive('Rate must be positive'),
    amount: z.number().positive('Amount must be positive'),
  })).min(1, 'At least one item is required'),
  subtotal: z.number().nonnegative('Subtotal cannot be negative'),
  tax: z.number().nonnegative('Tax cannot be negative'),
  discount: z.number().nonnegative('Discount cannot be negative'),
  total: z.number().positive('Total must be positive'),
  currency: z.enum(['BDT', 'USD']),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  notes: z.string().optional(),
});

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

// Validate and sanitize form data
export const validateAndSanitizeData = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    // Sanitize string fields if data is an object
    if (typeof data === 'object' && data !== null) {
      const sanitizedData = Object.entries(data as Record<string, unknown>).reduce<Record<string, unknown>>((acc, [key, value]) => {
        acc[key] = typeof value === 'string' ? sanitizeInput(value) : value;
        return acc;
      }, {});
      
      const result = schema.parse(sanitizedData);
      return { success: true, data: result };
    }
    
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      success: false,
      errors: ['Validation failed']
    };
  }
};