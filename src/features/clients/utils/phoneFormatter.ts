/**
 * Phone number formatting utilities
 */

/**
 * Formats a phone number for display
 * Formats as: XXX XXX XXXX or similar based on length
 */
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // Format based on length
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  } else if (digits.length <= 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  } else {
    // For longer numbers, format differently
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)} ${digits.slice(10)}`;
  }
};

/**
 * Removes formatting from phone number
 */
export const unformatPhoneNumber = (formatted: string): string => {
  return formatted.replace(/\s/g, '');
};

