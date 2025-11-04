/**
 * Tests for phone number parsing utilities
 */
import { describe, it, expect } from 'vitest';
import { extractCountryCode, removeCountryCode } from './phoneParser';

describe('phoneParser', () => {
  describe('extractCountryCode', () => {
    it('should extract Colombia country code (+57)', () => {
      const result = extractCountryCode('+573001234567');
      expect(result.code).toBe('+57');
      expect(result.number).toBe('3001234567');
    });

    it('should extract Venezuela country code (+58)', () => {
      const result = extractCountryCode('+584121234567');
      expect(result.code).toBe('+58');
      expect(result.number).toBe('4121234567');
    });

    it('should extract USA/Canada country code (+1)', () => {
      const result = extractCountryCode('+15551234567');
      expect(result.code).toBe('+1');
      expect(result.number).toBe('5551234567');
    });

    it('should default to Colombia (+57) when no code is found', () => {
      const result = extractCountryCode('3001234567');
      expect(result.code).toBe('+57');
      expect(result.number).toBe('3001234567');
    });

    it('should default to Colombia (+57) for empty string', () => {
      const result = extractCountryCode('');
      expect(result.code).toBe('+57');
      expect(result.number).toBe('');
    });

    it('should handle phone numbers with country code at start', () => {
      const result = extractCountryCode('+5730012345678');
      expect(result.code).toBe('+57');
      expect(result.number).toBe('30012345678');
    });

    it('should handle phone numbers without country code', () => {
      const result = extractCountryCode('3001234567');
      expect(result.code).toBe('+57');
      expect(result.number).toBe('3001234567');
    });

    it('should handle phone numbers with formatting', () => {
      const result = extractCountryCode('+57 300 123 4567');
      expect(result.code).toBe('+57');
      expect(result.number).toBe(' 300 123 4567');
    });

    it('should prioritize longer country codes (e.g., +57 before +5)', () => {
      // This tests that it matches the correct code
      const result = extractCountryCode('+57300123456');
      expect(result.code).toBe('+57');
    });
  });

  describe('removeCountryCode', () => {
    it('should remove Colombia country code (+57)', () => {
      expect(removeCountryCode('+573001234567')).toBe('3001234567');
    });

    it('should remove Venezuela country code (+58)', () => {
      expect(removeCountryCode('+584121234567')).toBe('4121234567');
    });

    it('should remove USA/Canada country code (+1)', () => {
      expect(removeCountryCode('+15551234567')).toBe('5551234567');
    });

    it('should return original number if no country code is found', () => {
      expect(removeCountryCode('3001234567')).toBe('3001234567');
      expect(removeCountryCode('1234567890')).toBe('1234567890');
    });

    it('should handle empty string', () => {
      expect(removeCountryCode('')).toBe('');
    });

    it('should handle phone numbers with formatting', () => {
      expect(removeCountryCode('+57 300 123 4567')).toBe(' 300 123 4567');
    });

    it('should handle numbers that start with country code digits but not the code itself', () => {
      // Number starting with 57 but not +57
      expect(removeCountryCode('57300123456')).toBe('57300123456');
    });
  });
});

