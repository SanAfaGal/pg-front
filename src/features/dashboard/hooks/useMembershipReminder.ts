import { useMemo, useCallback } from 'react';

const STORAGE_KEY = 'membership_reminder_shown';

/**
 * Hook personalizado para gestionar el estado del recordatorio de membresías.
 * 
 * Gestiona el estado en sessionStorage para que persista durante la sesión
 * del navegador pero se limpie al cerrar la pestaña/ventana.
 * 
 * @returns Objeto con funciones y estado para gestionar el recordatorio
 */
export const useMembershipReminder = () => {
  /**
   * Verifica si el recordatorio ya se mostró en esta sesión.
   * Usa useMemo para evitar lecturas innecesarias del sessionStorage.
   */
  const hasShownReminder = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  }, []);

  /**
   * Marca el recordatorio como mostrado en sessionStorage.
   * Usa useCallback para mantener la referencia estable.
   */
  const markAsShown = useCallback(() => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  /**
   * Limpia el estado del recordatorio del sessionStorage.
   * Útil para resetear el estado cuando el usuario cierra sesión.
   */
  const clearReminderState = useCallback(() => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    hasShownReminder,
    markAsShown,
    clearReminderState,
  };
};

