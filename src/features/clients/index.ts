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

// Components (to be added later)
// export { ClientList } from './components/ClientList';
// export { ClientForm } from './components/ClientForm';
// export { ClientDetail } from './components/ClientDetail';
