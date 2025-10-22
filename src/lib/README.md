# Centralized API Client

Este archivo centraliza toda la lógica de llamadas a la API, eliminando duplicación y proporcionando una interfaz consistente.

## 🏗️ Estructura

### Configuración Centralizada
- **API_CONFIG**: Configuración de entorno (URL base, timeouts, etc.)
- **API_ENDPOINTS**: Todos los endpoints organizados por módulo
- **TokenManager**: Gestión centralizada de tokens de autenticación

### Cliente API Unificado
- **RealApiClient**: Cliente para API real con autenticación
- **MockApiClient**: Cliente para desarrollo con datos mock
- **Selección automática**: Basada en `VITE_USE_MOCK_API`

## 🔧 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_USE_MOCK_API=false
VITE_DISABLE_AUTH=false

# Development Configuration
VITE_DEBUG_MODE=true
```

## 📡 Uso

### Importar el cliente
```typescript
import { apiClient, API_ENDPOINTS } from '../lib/api';
```

### Hacer llamadas GET
```typescript
// Con parámetros
const data = await apiClient.get<ResponseType>(API_ENDPOINTS.plans.list, {
  params: { is_active: 'true', limit: 100 }
});

// Sin parámetros
const data = await apiClient.get<ResponseType>(API_ENDPOINTS.clients.list);
```

### Hacer llamadas POST/PUT/PATCH
```typescript
const result = await apiClient.post<ResponseType>(API_ENDPOINTS.subscriptions.list(clientId), {
  plan_id: 'plan-123',
  start_date: '2024-01-01'
});
```

### Gestión de tokens
```typescript
import { setTokens, getAccessToken, clearTokens } from '../lib/api';

// Establecer tokens
setTokens(accessToken, refreshToken);

// Obtener token actual
const token = getAccessToken();

// Limpiar tokens
clearTokens();
```

## 🎯 Endpoints Disponibles

### Autenticación
- `API_ENDPOINTS.auth.login`
- `API_ENDPOINTS.auth.logout`
- `API_ENDPOINTS.auth.me`
- `API_ENDPOINTS.auth.refresh`

### Clientes
- `API_ENDPOINTS.clients.list`
- `API_ENDPOINTS.clients.detail(id)`
- `API_ENDPOINTS.clients.dashboard(id)`
- `API_ENDPOINTS.clients.subscriptions(id)`
- `API_ENDPOINTS.clients.activeSubscription(id)`

### Planes
- `API_ENDPOINTS.plans.list`
- `API_ENDPOINTS.plans.detail(id)`

### Suscripciones
- `API_ENDPOINTS.subscriptions.list(clientId)`
- `API_ENDPOINTS.subscriptions.detail(id)`
- `API_ENDPOINTS.subscriptions.renew(clientId, id)`
- `API_ENDPOINTS.subscriptions.cancel(clientId, id)`

### Pagos
- `API_ENDPOINTS.payments.list(subscriptionId)`
- `API_ENDPOINTS.payments.stats(subscriptionId)`

## 🔄 Migración

### Antes (múltiples clientes)
```typescript
// ❌ Antes
import { apiClient } from '../config/api';
import { apiClient as mockClient } from '../shared/api/apiClient';
```

### Después (cliente unificado)
```typescript
// ✅ Ahora
import { apiClient, API_ENDPOINTS } from '../lib/api';
```

## 🛠️ Características

### ✅ Ventajas
- **Un solo cliente**: Elimina duplicación
- **Endpoints tipados**: Autocompletado y validación
- **Gestión de errores**: Centralizada y consistente
- **Autenticación**: Automática con tokens
- **Mock/Real**: Cambio automático por variable de entorno
- **Timeouts**: Configurables por tipo de operación
- **Logs**: Automáticos para debugging

### 🔧 Configuración Avanzada
```typescript
// Timeout personalizado
await apiClient.get('/endpoint', { timeout: 10000 });

// FormData para uploads
await apiClient.post('/upload', formData, { isFormData: true });
```

## 🚀 Próximos Pasos

1. **Crear archivo `.env`** con tu configuración
2. **Actualizar imports** en archivos existentes
3. **Probar endpoints** con la nueva estructura
4. **Eliminar archivos obsoletos** (`config/api.ts`, `shared/api/apiClient.ts`)
