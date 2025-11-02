import { type ClientFormData, type Client } from '../features/clients';
import { extractCountryCode } from './phoneParser';

export interface ClientApiPayload {
  dni_type: string;
  dni_number: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  second_last_name?: string;
  phone: string;
  alternative_phone?: string;
  birth_date: string;
  gender: 'male' | 'female' | 'other';
  address?: string;
}

export const mapClientToApi = (client: ClientFormData): ClientApiPayload => {
  const payload: ClientApiPayload = {
    dni_type: client.document_type,
    dni_number: client.document_number,
    first_name: client.first_name,
    last_name: client.first_surname,
    phone: client.phone_primary,
    birth_date: client.birth_date,
    gender: client.gender as 'male' | 'female' | 'other',
  };

  if (client.second_name && client.second_name.trim()) {
    payload.middle_name = client.second_name.trim();
  }

  if (client.second_surname && client.second_surname.trim()) {
    payload.second_last_name = client.second_surname.trim();
  }

  if (client.phone_secondary && client.phone_secondary.trim()) {
    payload.alternative_phone = client.phone_secondary.trim();
  }

  if (client.address && client.address.trim()) {
    payload.address = client.address.trim();
  }

  return payload;
};

export const mapClientFromApi = (apiClient: Client): ClientFormData & { phoneCode?: string; phoneCodeSecondary?: string } => {
  // Extract country codes from phone numbers
  const primaryPhone = extractCountryCode(apiClient.phone || '');
  const secondaryPhone = apiClient.alternative_phone 
    ? extractCountryCode(apiClient.alternative_phone)
    : { code: '+57', number: '' };

  return {
    document_type: apiClient.dni_type as any,
    document_number: apiClient.dni_number,
    first_name: apiClient.first_name,
    second_name: apiClient.middle_name || '',
    first_surname: apiClient.last_name,
    second_surname: apiClient.second_last_name || '',
    birth_date: apiClient.birth_date,
    gender: apiClient.gender,
    phone_primary: primaryPhone.number, // Only the number, without country code
    phone_secondary: secondaryPhone.number, // Only the number, without country code
    email: '',
    address: apiClient.address || '',
    photo_url: '',
    // Store phone codes separately for form use
    phoneCode: primaryPhone.code,
    phoneCodeSecondary: secondaryPhone.code,
  };
};
