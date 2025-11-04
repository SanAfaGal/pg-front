# Módulo de Asistencias con Reconocimiento Facial

Este módulo proporciona funcionalidades completas para el manejo de asistencias en el gimnasio utilizando reconocimiento facial.

## 🚀 Características Principales

### 1. Check-in Facial
- **Captura de cámara en tiempo real** con preview
- **Reconocimiento facial** automático
- **Validación de acceso** basada en suscripciones
- **Feedback visual** inmediato

### 2. Dashboard de Métricas
- **Estadísticas en tiempo real** (hoy, semana, mes)
- **Gráficos interactivos** por hora y tendencias
- **Lista de asistencias recientes**
- **Actualización automática** cada 30 segundos

### 3. Historial de Asistencias
- **Tabla completa** con ordenamiento y paginación
- **Filtros avanzados** (fechas, búsqueda)
- **Exportación a CSV**
- **Modal de detalles** para cada asistencia

## 📁 Estructura del Módulo

```
src/features/attendances/
├── types/index.ts                    # Tipos TypeScript
├── api/attendanceApi.ts              # API client
├── hooks/useAttendances.ts          # Hooks personalizados
├── utils/
│   ├── cameraUtils.ts               # Utilidades de cámara
│   └── imageUtils.ts                # Utilidades de imagen
└── components/
    ├── AttendancePage.tsx           # Página principal con tabs
    ├── CheckInFacial.tsx           # Check-in facial
    ├── AttendanceDashboard.tsx     # Dashboard
    ├── AttendanceHistory.tsx       # Historial
    ├── CameraCapture.tsx           # Captura de cámara
    ├── CheckInResult.tsx           # Resultado de check-in
    ├── MetricsCards.tsx            # Tarjetas de métricas
    ├── AttendanceChart.tsx         # Gráficos
    ├── RecentAttendances.tsx       # Asistencias recientes
    ├── AttendanceFilters.tsx       # Filtros
    ├── AttendanceTable.tsx          # Tabla de asistencias
    └── AttendanceDetail.tsx        # Detalles de asistencia
```

## 🔧 API Endpoints

### Check-in Facial
```typescript
POST /api/v1/attendances/check-in
{
  "image_base64": "string"
}
```

### Listado de Asistencias
```typescript
GET /api/v1/attendances?limit=100&offset=0&start_date=2025-01-01T00:00:00Z&end_date=2025-01-31T23:59:59Z
```

### Métricas
```typescript
GET /api/v1/attendances/metrics
GET /api/v1/attendances/stats
```

## 🎯 Uso del Módulo

### 1. Check-in Facial
```typescript
import { CheckInFacial } from '../features/attendances';

// El componente maneja automáticamente:
// - Inicialización de cámara
// - Captura de imagen
// - Envío a API
// - Manejo de respuestas
<CheckInFacial />
```

### 2. Dashboard
```typescript
import { AttendanceDashboard } from '../features/attendances';

// Muestra métricas y gráficos en tiempo real
<AttendanceDashboard />
```

### 3. Historial
```typescript
import { AttendanceHistory } from '../features/attendances';

// Tabla con filtros y paginación
<AttendanceHistory />
```

## 🔐 Seguridad

- **Autenticación OAuth2** con Bearer tokens
- **Validación de permisos** de cámara
- **No almacenamiento** de imágenes faciales
- **Manejo seguro** de tokens expirados

## 📱 Responsive Design

- **Diseño adaptativo** para móviles y desktop
- **Navegación por tabs** intuitiva
- **Estados de carga** y feedback visual
- **Manejo de errores** con mensajes claros

## 🚀 Integración

El módulo está completamente integrado en la aplicación:

1. **Navegación**: Agregado al menú lateral
2. **Routing**: Integrado en el Dashboard principal
3. **API**: Endpoints agregados al cliente API
4. **Estados**: Hooks personalizados para manejo de estado

## 🛠️ Desarrollo

### Hooks Disponibles
- `useAttendances()` - Lista de asistencias
- `useAttendance(id)` - Asistencia individual
- `useAttendanceMetrics()` - Métricas del dashboard
- `useCheckIn()` - Check-in facial
- `useAttendanceHistory()` - Historial con filtros

### Utilidades
- `initializeCamera()` - Inicializar cámara
- `captureImageFromVideo()` - Capturar imagen
- `formatImageForAPI()` - Optimizar imagen para API

## 📊 Estados de la UI

### Check-in
```typescript
{
  isCapturing: boolean,
  isCameraActive: boolean,
  capturedImage: string | null,
  isProcessing: boolean,
  result: CheckInResponse | null
}
```

### Historial
```typescript
{
  attendances: AttendanceWithClient[],
  isLoading: boolean,
  filters: AttendanceFilters,
  pagination: AttendancePagination
}
```

### Dashboard
```typescript
{
  metrics: AttendanceMetrics | null,
  recentAttendances: AttendanceWithClient[],
  isLoading: boolean
}
```

## 🎨 Componentes Principales

### AttendancePage
Página principal con navegación por tabs:
- **Check-in**: Captura facial
- **Dashboard**: Métricas y gráficos
- **Historial**: Tabla con filtros

### CameraCapture
Componente de captura de cámara:
- Preview en tiempo real
- Indicador de área facial
- Botones de captura/retomar
- Manejo de errores

### CheckInResult
Muestra el resultado del check-in:
- **Éxito**: Mensaje de bienvenida
- **Denegado**: Razón y sugerencias
- **Error**: Mensaje específico

## 🔄 Flujo de Trabajo

1. **Usuario accede** al módulo de asistencias
2. **Selecciona "Check-in"** en la navegación
3. **Autoriza cámara** si es necesario
4. **Posiciona rostro** en el área de captura
5. **Captura imagen** con el botón
6. **Sistema procesa** y valida acceso
7. **Muestra resultado** (éxito/denegado)
8. **Registra asistencia** si es exitoso

## 📈 Métricas Disponibles

- **Asistencias hoy**: Contador diario
- **Asistencias esta semana**: Total semanal
- **Asistencias este mes**: Total mensual
- **Gráfico por horas**: Distribución horaria
- **Tendencia semanal**: Evolución por días
- **Asistencias recientes**: Lista en tiempo real

## 🎯 Casos de Uso

### Para Empleados
- Check-in rápido de clientes
- Verificación de acceso
- Consulta de asistencias recientes

### Para Administradores
- Monitoreo de métricas
- Análisis de tendencias
- Exportación de datos
- Gestión de historial

## 🚨 Manejo de Errores

### Errores de Cámara
- Permisos denegados
- Cámara no disponible
- Dispositivo en uso

### Errores de Reconocimiento
- Rostro no detectado
- Usuario no reconocido
- Imagen de baja calidad

### Errores de Acceso
- Suscripción vencida
- Cliente inactivo
- Sin suscripción activa

## 🔧 Configuración

### Variables de Entorno
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_DISABLE_AUTH=false
```

### Permisos de Cámara
El navegador solicitará permisos automáticamente. Si se deniegan:
1. Verificar configuración del navegador
2. Reiniciar la aplicación
3. Verificar que la cámara no esté en uso

## 📱 Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge
- **Dispositivos**: Desktop, tablet, móvil
- **Cámaras**: Webcam, cámara frontal móvil
- **Resoluciones**: 640x480 mínimo recomendado

## 🚀 Próximas Mejoras

- [ ] Reconocimiento de múltiples rostros
- [ ] Historial de intentos fallidos
- [ ] Notificaciones push
- [ ] Integración con sistema de clases
- [ ] Reportes avanzados
- [ ] API de webhooks
