// Types
export type {
  Client,
  BiometricData,
  ClientFormData,
  ClientFilters,
  ClientDashboardResponse,
  ClientStats,
} from './types';

// API
export { clientsApi } from './api/clientsApi';

// Hooks
export {
  useClients,
  useClient,
  useClientDashboard,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
  useToggleClientStatus,
  useUploadBiometric,
  useRegisterFaceBiometric,
  useUpdateFaceBiometric,
} from './hooks/useClients';

// Utils
export { clientHelpers } from './utils/clientHelpers';
export { formatPhoneNumber, unformatPhoneNumber } from './utils/phoneFormatter';
export { extractCountryCode, removeCountryCode } from './utils/phoneParser';
export { mapClientToApi, mapClientFromApi } from './utils/clientMapper';
export type { ClientApiPayload } from './utils/clientMapper';

// Constants
export * from './constants/clientConstants';

// Query Keys
export { clientKeys } from './hooks/useClients';

// Components
export { ClientList } from './components/ClientList';
export { ClientCard } from './components/ClientCard';
export { ClientCards } from './components/ClientCards';
export { ClientForm } from './components/ClientForm';
export { ClientFormModal } from './components/ClientFormModal';
export { ClientInfoTab } from './components/ClientInfoTab';
export { BiometricCapture } from './components/BiometricCapture';
export { BiometricCaptureModal } from './components/BiometricCaptureModal';
export { AttendanceTab } from './components/AttendanceTab/AttendanceTab';
