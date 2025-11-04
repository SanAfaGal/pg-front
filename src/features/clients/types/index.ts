export interface Client {
  id: string;
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
  is_active: boolean;
  created_at: string;
  updated_at: string;
  meta_info: Record<string, unknown>;
  biometric?: BiometricData;
}

export interface BiometricData {
  id: string;
  type: string;
  data: string;
  thumbnail?: string;
  has_face_biometric?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClientFormData {
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
  is_active?: boolean;
  // Additional fields for form mapping
  phoneCode?: string;
  phoneCodeSecondary?: string;
}

export interface ClientFilters {
  is_active?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ClientDashboardResponse {
  client: Client;
  biometric?: BiometricData;
  active_subscription?: {
    id: string;
    plan_name: string;
    start_date: string;
    end_date: string;
    status: string;
  };
  recent_payments?: Array<{
    id: string;
    amount: number;
    payment_date: string;
    status: string;
  }>;
  statistics: {
    total_payments: number;
    total_amount: number;
    last_payment_date?: string;
  };
}

export interface ClientStats {
  total_clients: number;
  active_clients: number;
  inactive_clients: number;
  new_clients_this_month: number;
}
