/**
 * Phone number parsing utilities
 * Extracts country code from phone numbers
 */

const COUNTRY_CODES = ['+57', '+58', '+1'];

/**
 * Extracts country code from a phone number
 * Returns the code and the number without the code
 */
export const extractCountryCode = (phone: string): { code: string; number: string } => {
  if (!phone) return { code: '+57', number: '' };

  // Try to find matching country code
  for (const code of COUNTRY_CODES) {
    if (phone.startsWith(code)) {
      return {
        code,
        number: phone.slice(code.length),
      };
    }
  }

  // Default to Colombia if no code found
  return { code: '+57', number: phone };
};

/**
 * Removes country code from phone number if present
 */
export const removeCountryCode = (phone: string): string => {
  if (!phone) return '';

  for (const code of COUNTRY_CODES) {
    if (phone.startsWith(code)) {
      return phone.slice(code.length);
    }
  }

  return phone;
};

