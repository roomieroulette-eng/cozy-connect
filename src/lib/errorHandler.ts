/**
 * Error handler utility for sanitizing Supabase errors before displaying to users.
 * Prevents information leakage by mapping technical errors to user-friendly messages.
 */

export function getUserFriendlyError(error: unknown): string {
  // Log full error in development for debugging
  if (import.meta.env.DEV) {
    console.error('Detailed error for debugging:', error);
  }

  const errorObj = error as { code?: string; message?: string } | null;
  const errorCode = errorObj?.code;
  const errorMessage = errorObj?.message?.toLowerCase() || '';

  // Authentication errors
  if (errorMessage.includes('invalid login credentials')) {
    return 'Invalid email or password. Please try again.';
  }
  if (errorMessage.includes('email not confirmed')) {
    return 'Please verify your email before signing in.';
  }
  if (errorMessage.includes('user already registered')) {
    return 'This email is already registered. Try signing in instead.';
  }
  if (errorMessage.includes('password') && errorMessage.includes('weak')) {
    return 'Password is too weak. Please use a stronger password.';
  }
  if (errorMessage.includes('email') && errorMessage.includes('invalid')) {
    return 'Please enter a valid email address.';
  }
  if (errorMessage.includes('signup') && errorMessage.includes('disabled')) {
    return 'Sign up is currently disabled. Please try again later.';
  }

  // Database errors
  if (errorCode === '23505') { // Unique violation
    return 'This information is already in use.';
  }
  if (errorCode === '23503') { // Foreign key violation
    return 'Unable to complete this action. Please try again.';
  }
  if (errorCode === '23502') { // Not null violation
    return 'Please fill in all required fields.';
  }
  if (errorMessage.includes('row-level security')) {
    return 'You do not have permission to perform this action.';
  }

  // Storage errors
  if (errorMessage.includes('storage') || errorMessage.includes('bucket')) {
    return 'Failed to upload file. Please try again.';
  }
  if (errorMessage.includes('file size') || errorMessage.includes('too large')) {
    return 'File is too large. Please choose a smaller file.';
  }
  if (errorMessage.includes('mime') || errorMessage.includes('file type')) {
    return 'Invalid file type. Please upload an image file.';
  }

  // Network errors
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'Connection error. Please check your internet and try again.';
  }
  if (errorMessage.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // Generic fallback
  return 'An error occurred. Please try again or contact support.';
}
