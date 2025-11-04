/**
 * Tests for client mapper utilities
 */
import { describe, it, expect } from 'vitest';
import { mapClientToApi, mapClientFromApi } from './clientMapper';
import { Client, ClientFormData } from '../types';
import type { ClientApiPayload } from './clientMapper';

describe('clientMapper', () => {
  describe('mapClientToApi', () => {
    it('should map ClientFormData to API payload format', () => {
      const clientFormData: ClientFormData = {
        dni_type: 'cc',
        dni_number: '1234567890',
        first_name: 'Juan',
        middle_name: 'Carlos',
        last_name: 'Pérez',
        second_last_name: 'González',
        phone: '+573001234567',
        alternative_phone: '+573001234568',
        birth_date: '1990-01-01',
        gender: 'male',
        address: 'Calle 123 #45-67',
      };

      const result = mapClientToApi(clientFormData);

      expect(result).toEqual({
        dni_type: 'cc',
        dni_number: '1234567890',
        first_name: 'Juan',
        middle_name: 'Carlos',
        last_name: 'Pérez',
        second_last_name: 'González',
        phone: '+573001234567',
        alternative_phone: '+573001234568',
        birth_date: '1990-01-01',
        gender: 'male',
        address: 'Calle 123 #45-67',
      });
    });

    it('should map ExtendedClientFormData (form internal format) to API payload', () => {
      const formData = {
        document_type: 'cc',
        document_number: '1234567890',
        first_name: 'María',
        second_name: 'José',
        first_surname: 'Rodríguez',
        second_surname: 'López',
        phone_primary: '3001234567',
        phone_secondary: '3001234568',
        birth_date: '1990-01-01',
        gender: 'female' as const,
        address: 'Calle 456 #78-90',
      };

      const result = mapClientToApi(formData);

      expect(result).toEqual({
        dni_type: 'cc',
        dni_number: '1234567890',
        first_name: 'María',
        middle_name: 'José',
        last_name: 'Rodríguez',
        second_last_name: 'López',
        phone: '3001234567',
        alternative_phone: '3001234568',
        birth_date: '1990-01-01',
        gender: 'female',
        address: 'Calle 456 #78-90',
      });
    });

    it('should handle optional fields correctly', () => {
      const clientFormData: ClientFormData = {
        dni_type: 'cc',
        dni_number: '1234567890',
        first_name: 'Juan',
        last_name: 'Pérez',
        phone: '+573001234567',
        birth_date: '1990-01-01',
        gender: 'male',
      };

      const result = mapClientToApi(clientFormData);

      expect(result.middle_name).toBeUndefined();
      expect(result.second_last_name).toBeUndefined();
      expect(result.alternative_phone).toBeUndefined();
      expect(result.address).toBeUndefined();
    });

    it('should trim whitespace from optional fields', () => {
      const clientFormData: ClientFormData = {
        dni_type: 'cc',
        dni_number: '1234567890',
        first_name: 'Juan',
        middle_name: '  Carlos  ',
        last_name: 'Pérez',
        second_last_name: '  González  ',
        phone: '+573001234567',
        alternative_phone: '  3001234568  ',
        birth_date: '1990-01-01',
        gender: 'male',
        address: '  Calle 123  ',
      };

      const result = mapClientToApi(clientFormData);

      expect(result.middle_name).toBe('Carlos');
      expect(result.second_last_name).toBe('González');
      expect(result.alternative_phone).toBe('3001234568');
      expect(result.address).toBe('Calle 123');
    });

    it('should handle empty strings in optional fields', () => {
      const clientFormData: ClientFormData = {
        dni_type: 'cc',
        dni_number: '1234567890',
        first_name: 'Juan',
        middle_name: '',
        last_name: 'Pérez',
        second_last_name: '',
        phone: '+573001234567',
        alternative_phone: '',
        birth_date: '1990-01-01',
        gender: 'male',
        address: '',
      };

      const result = mapClientToApi(clientFormData);

      expect(result.middle_name).toBeUndefined();
      expect(result.second_last_name).toBeUndefined();
      expect(result.alternative_phone).toBeUndefined();
      expect(result.address).toBeUndefined();
    });
  });

  describe('mapClientFromApi', () => {
    const mockClient: Client = {
      id: 'client-1',
      dni_type: 'cc',
      dni_number: '1234567890',
      first_name: 'Juan',
      middle_name: 'Carlos',
      last_name: 'Pérez',
      second_last_name: 'González',
      phone: '+573001234567',
      alternative_phone: '+573001234568',
      birth_date: '1990-01-01',
      gender: 'male',
      address: 'Calle 123 #45-67',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      meta_info: {},
    };

    it('should map Client from API to ClientFormData with phone codes', () => {
      const result = mapClientFromApi(mockClient);

      expect(result.dni_type).toBe('cc');
      expect(result.dni_number).toBe('1234567890');
      expect(result.first_name).toBe('Juan');
      expect(result.middle_name).toBe('Carlos');
      expect(result.last_name).toBe('Pérez');
      expect(result.second_last_name).toBe('González');
      expect(result.phone).toBe('+573001234567');
      expect(result.alternative_phone).toBe('+573001234568');
      expect(result.birth_date).toBe('1990-01-01');
      expect(result.gender).toBe('male');
      expect(result.address).toBe('Calle 123 #45-67');
      expect(result.is_active).toBe(true);
      expect(result.phoneCode).toBe('+57');
      expect(result.phoneCodeSecondary).toBe('+57');
    });

    it('should extract country codes correctly from phone numbers', () => {
      const clientWithDifferentCodes: Client = {
        ...mockClient,
        phone: '+15551234567',
        alternative_phone: '+584121234567',
      };

      const result = mapClientFromApi(clientWithDifferentCodes);

      expect(result.phoneCode).toBe('+1');
      expect(result.phoneCodeSecondary).toBe('+58');
    });

    it('should handle missing alternative phone', () => {
      const clientWithoutAltPhone: Client = {
        ...mockClient,
        alternative_phone: undefined,
      };

      const result = mapClientFromApi(clientWithoutAltPhone);

      expect(result.alternative_phone).toBeUndefined();
      expect(result.phoneCodeSecondary).toBe('+57');
    });

    it('should handle empty phone numbers', () => {
      const clientWithEmptyPhone: Client = {
        ...mockClient,
        phone: '',
        alternative_phone: '',
      };

      const result = mapClientFromApi(clientWithEmptyPhone);

      expect(result.phone).toBe('');
      expect(result.phoneCode).toBe('+57');
      expect(result.phoneCodeSecondary).toBe('+57');
    });

    it('should handle missing optional fields', () => {
      const minimalClient: Client = {
        id: 'client-2',
        dni_type: 'ce',
        dni_number: 'AB123456',
        first_name: 'María',
        last_name: 'Rodríguez',
        phone: '+573001234567',
        birth_date: '1990-01-01',
        gender: 'female',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        meta_info: {},
      };

      const result = mapClientFromApi(minimalClient);

      expect(result.middle_name).toBeUndefined();
      expect(result.second_last_name).toBeUndefined();
      expect(result.alternative_phone).toBeUndefined();
      expect(result.address).toBeUndefined();
    });
  });
});

