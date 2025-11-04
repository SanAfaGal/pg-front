import { type ClientFormData, type Client } from '../types';
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

// Extended ClientFormData for form internal use
interface ExtendedClientFormData extends ClientFormData {
  document_type?: string;
  document_number?: string;
  second_name?: string;
  first_surname?: string;
  second_surname?: string;
  phone_primary?: string;
  phone_secondary?: string;
}

export const mapClientToApi = (client: ExtendedClientFormData | ClientFormData): ClientApiPayload => {
  // Handle both API format (ClientFormData) and form internal format
  const isApiFormat = 'dni_type' in client && 'phone' in client;
  
  const payload: ClientApiPayload = {
    dni_type: isApiFormat ? client.dni_type : (client as ExtendedClientFormData).document_type || '',
    dni_number: isApiFormat ? client.dni_number : (client as ExtendedClientFormData).document_number || '',
    first_name: client.first_name,
    last_name: isApiFormat ? client.last_name : (client as ExtendedClientFormData).first_surname || '',
    phone: isApiFormat ? client.phone : (client as ExtendedClientFormData).phone_primary || '',
    birth_date: client.birth_date,
    gender: client.gender as 'male' | 'female' | 'other',
  };

  if (isApiFormat) {
    if (client.middle_name && client.middle_name.trim()) {
      payload.middle_name = client.middle_name.trim();
    }
    if (client.second_last_name && client.second_last_name.trim()) {
      payload.second_last_name = client.second_last_name.trim();
    }
    if (client.alternative_phone && client.alternative_phone.trim()) {
      payload.alternative_phone = client.alternative_phone.trim();
    }
  } else {
    const formClient = client as ExtendedClientFormData;
    if (formClient.second_name && formClient.second_name.trim()) {
      payload.middle_name = formClient.second_name.trim();
    }
    if (formClient.second_surname && formClient.second_surname.trim()) {
      payload.second_last_name = formClient.second_surname.trim();
    }
    if (formClient.phone_secondary && formClient.phone_secondary.trim()) {
      payload.alternative_phone = formClient.phone_secondary.trim();
    }
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
    dni_type: apiClient.dni_type,
    dni_number: apiClient.dni_number,
    first_name: apiClient.first_name,
    middle_name: apiClient.middle_name,
    last_name: apiClient.last_name,
    second_last_name: apiClient.second_last_name,
    phone: apiClient.phone,
    alternative_phone: apiClient.alternative_phone,
    birth_date: apiClient.birth_date,
    gender: apiClient.gender,
    address: apiClient.address,
    is_active: apiClient.is_active,
    // Store phone codes separately for form use
    phoneCode: primaryPhone.code,
    phoneCodeSecondary: secondaryPhone.code,
  };
};


