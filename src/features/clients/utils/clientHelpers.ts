import { Client, ClientFormData } from '../types';

export const clientHelpers = {
  calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  },

  formatFullName(client: Client | ClientFormData): string {
    if ('dni_type' in client) {
      const parts = [
        client.first_name,
        client.middle_name,
        client.last_name,
        client.second_last_name,
      ].filter(Boolean);
      return parts.join(' ');
    } else {
      const parts = [
        client.first_name,
        client.second_name,
        client.first_surname,
        client.second_surname,
      ].filter(Boolean);
      return parts.join(' ');
    }
  },

  formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX for US numbers or similar format
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    return phone; // Return original if not 10 digits
  },

  getInitials(client: Client | ClientFormData): string {
    const fullName = clientHelpers.formatFullName(client);
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  },

  isClientActive(client: Client): boolean {
    return client.is_active;
  },

  getClientStatus(client: Client): 'active' | 'inactive' {
    return client.is_active ? 'active' : 'inactive';
  },

  formatDocumentNumber(dniType: string, dniNumber: string): string {
    return `${dniType} ${dniNumber}`;
  },

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  validateDocumentNumber(dniNumber: string): boolean {
    // Basic validation - can be enhanced based on specific country requirements
    return /^\d{6,12}$/.test(dniNumber);
  },
};
