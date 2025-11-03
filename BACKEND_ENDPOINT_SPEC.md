# Especificación Técnica: Endpoint `/api/v1/statistics` para Dashboard Administrador

## Contexto

Necesitamos implementar un endpoint consolidado que proporcione todas las métricas y estadísticas necesarias para el dashboard principal del administrador del gimnasio. Este endpoint debe optimizar el rendimiento agregando datos en el servidor en lugar de requerir múltiples llamadas HTTP desde el frontend.

## Especificación del Endpoint

### Ruta
```
GET /api/v1/statistics
```

### Autenticación
- Requiere token OAuth2 Bearer (igual que otros endpoints)
- Solo usuarios con rol `admin` pueden acceder

### Query Parameters (Opcionales)

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `period` | `string` | `'month'` | Período de análisis: `'today'`, `'week'`, `'month'`, `'year'` |
| `date` | `string` | `today` | Fecha de referencia en formato `YYYY-MM-DD` |

**Ejemplos de uso:**
- `/api/v1/statistics` - Estadísticas del mes actual
- `/api/v1/statistics?period=today` - Estadísticas de hoy
- `/api/v1/statistics?period=week&date=2025-01-15` - Semana que contiene el 15 de enero

### Response Status Codes

- `200 OK`: Respuesta exitosa
- `401 Unauthorized`: Token inválido o ausente
- `403 Forbidden`: Usuario no es administrador
- `422 Validation Error`: Parámetros inválidos

## Estructura de Respuesta JSON

```json
{
  "period": {
    "type": "month",
    "start_date": "2025-01-01",
    "end_date": "2025-01-31",
    "reference_date": "2025-01-15"
  },
  "client_stats": {
    "total": 850,
    "active": 723,
    "inactive": 127,
    "new_this_period": 45,
    "new_today": 3,
    "new_this_week": 12,
    "with_active_subscription": 698,
    "with_expired_subscription": 125,
    "with_pending_payment": 15
  },
  "subscription_stats": {
    "total": 1850,
    "active": 698,
    "expired": 892,
    "pending_payment": 15,
    "canceled": 240,
    "scheduled": 5,
    "expiring_soon": 8,
    "expired_recently": 23
  },
  "financial_stats": {
    "period_revenue": "12500000.00",
    "revenue_today": "450000.00",
    "revenue_this_week": "3200000.00",
    "revenue_this_month": "12500000.00",
    "pending_debt": "2500000.00",
    "debt_count": 15,
    "average_payment": "85000.00",
    "total_payments_count": 147,
    "payments_today": 12,
    "revenue_by_method": {
      "cash": "8500000.00",
      "qr": "3000000.00",
      "transfer": "800000.00",
      "card": "200000.00"
    }
  },
  "attendance_stats": {
    "today": 156,
    "this_week": 892,
    "this_month": 3845,
    "this_period": 3845,
    "peak_hour": "18:00",
    "average_daily": 125,
    "unique_visitors": 523,
    "attendance_rate": 72.3
  },
  "inventory_stats": {
    "total_products": 45,
    "active_products": 42,
    "low_stock_count": 5,
    "out_of_stock_count": 2,
    "overstock_count": 1,
    "total_inventory_value": "15000000.00",
    "total_units": 1250,
    "sales_today": {
      "units": 125,
      "amount": "312500.00",
      "transactions": 45
    },
    "sales_this_week": {
      "units": 892,
      "amount": "2230000.00",
      "transactions": 312
    }
  },
  "recent_activities": [
    {
      "id": "act-1",
      "type": "check_in",
      "description": "Juan Pérez ingresó al gimnasio",
      "timestamp": "2025-01-15T18:30:00Z",
      "client_id": "550e8400-e29b-41d4-a716-446655440001",
      "client_name": "Juan Pérez",
      "metadata": {
        "attendance_id": "550e8400-e29b-41d4-a716-446655440000"
      }
    },
    {
      "id": "act-2",
      "type": "payment_received",
      "description": "María García realizó un pago de $150,000",
      "timestamp": "2025-01-15T17:45:00Z",
      "client_id": "550e8400-e29b-41d4-a716-446655440002",
      "client_name": "María García",
      "metadata": {
        "payment_id": "pay-uuid",
        "amount": "150000.00",
        "method": "cash"
      }
    },
    {
      "id": "act-3",
      "type": "client_registration",
      "description": "Nuevo cliente registrado: Carlos Rodríguez",
      "timestamp": "2025-01-15T16:20:00Z",
      "client_id": "550e8400-e29b-41d4-a716-446655440003",
      "client_name": "Carlos Rodríguez"
    },
    {
      "id": "act-4",
      "type": "subscription_created",
      "description": "Nueva suscripción creada para Ana Martínez",
      "timestamp": "2025-01-15T15:10:00Z",
      "client_id": "550e8400-e29b-41d4-a716-446655440004",
      "client_name": "Ana Martínez",
      "metadata": {
        "subscription_id": "sub-uuid",
        "plan_name": "Plan Premium"
      }
    }
  ],
  "alerts": [
    {
      "type": "low_stock",
      "severity": "warning",
      "message": "5 productos con stock bajo",
      "count": 5
    },
    {
      "type": "out_of_stock",
      "severity": "error",
      "message": "2 productos sin stock",
      "count": 2
    },
    {
      "type": "subscriptions_expiring",
      "severity": "info",
      "message": "8 suscripciones expiran en los próximos 7 días",
      "count": 8
    },
    {
      "type": "pending_debt",
      "severity": "warning",
      "message": "15 suscripciones con pagos pendientes",
      "count": 15,
      "total_amount": "2500000.00"
    }
  ],
  "generated_at": "2025-01-15T18:45:30Z"
}
```

## Descripción Detallada de Campos

### `period`
Información sobre el período de análisis calculado basado en los parámetros.

- `type`: Tipo de período (`today`, `week`, `month`, `year`)
- `start_date`: Fecha de inicio del período (ISO date: `YYYY-MM-DD`)
- `end_date`: Fecha de fin del período (ISO date: `YYYY-MM-DD`)
- `reference_date`: Fecha de referencia usada para calcular el período (ISO date: `YYYY-MM-DD`)

### `client_stats`
Estadísticas de clientes.

- `total`: Total de clientes en el sistema
- `active`: Clientes con `is_active = true`
- `inactive`: Clientes con `is_active = false`
- `new_this_period`: Clientes creados dentro del período (`created_at >= start_date AND created_at <= end_date`)
- `new_today`: Clientes creados hoy (`DATE(created_at) = CURRENT_DATE`)
- `new_this_week`: Clientes creados en los últimos 7 días
- `with_active_subscription`: Clientes que tienen al menos una suscripción con estado `active`
- `with_expired_subscription`: Clientes que solo tienen suscripciones expiradas (sin suscripciones activas)
- `with_pending_payment`: Clientes con suscripciones en estado `pending_payment`

### `subscription_stats`
Estadísticas de suscripciones.

- `total`: Total de suscripciones
- `active`: Suscripciones con `status = 'active'`
- `expired`: Suscripciones con `status = 'expired'`
- `pending_payment`: Suscripciones con `status = 'pending_payment'`
- `canceled`: Suscripciones con `status = 'canceled'`
- `scheduled`: Suscripciones con `status = 'scheduled'`
- `expiring_soon`: Suscripciones activas que expiran en los próximos 7 días (`end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 7`)
- `expired_recently`: Suscripciones que expiraron en los últimos 7 días (`end_date BETWEEN CURRENT_DATE - 7 AND CURRENT_DATE`)

### `financial_stats`
Estadísticas financieras (pagos e ingresos).

- `period_revenue`: Suma de todos los pagos dentro del período (`payment_date >= start_date AND payment_date <= end_date`)
- `revenue_today`: Suma de pagos de hoy (`DATE(payment_date) = CURRENT_DATE`)
- `revenue_this_week`: Suma de pagos de los últimos 7 días
- `revenue_this_month`: Suma de pagos del mes actual
- `pending_debt`: Suma total de deudas pendientes (diferencia entre precio del plan y pagos recibidos para suscripciones con `status = 'pending_payment'`)
- `debt_count`: Número de suscripciones con deuda pendiente
- `average_payment`: Promedio de monto de pagos (`total_amount / total_payments_count`)
- `total_payments_count`: Total de pagos registrados
- `payments_today`: Número de pagos realizados hoy
- `revenue_by_method`: Desglose de ingresos por método de pago (`cash`, `qr`, `transfer`, `card`)

**Nota importante:** Todos los montos monetarios deben retornarse como strings decimales con 2 decimales (ej: `"12500000.00"`) para evitar problemas de precisión con números grandes.

### `attendance_stats`
Estadísticas de asistencias.

- `today`: Asistencias de hoy (`DATE(check_in) = CURRENT_DATE`)
- `this_week`: Asistencias de los últimos 7 días
- `this_month`: Asistencias del mes actual
- `this_period`: Asistencias dentro del período (`check_in >= start_date AND check_in <= end_date`)
- `peak_hour`: Hora del día con más asistencias en formato `HH:MM` (24 horas)
- `average_daily`: Promedio diario de asistencias en el período (`this_period / days_in_period`)
- `unique_visitors`: Número de clientes únicos que asistieron en el período (`COUNT(DISTINCT client_id)`)
- `attendance_rate`: Porcentaje de clientes activos que asistieron (`unique_visitors / client_stats.active * 100`)

### `inventory_stats`
Estadísticas de inventario. **Nota:** Pueden reutilizar la lógica del endpoint existente `/api/v1/inventory/reports/stats` y agregar información de ventas.

- `total_products`: Total de productos
- `active_products`: Productos con `is_active = true`
- `low_stock_count`: Productos con `available_quantity <= min_stock`
- `out_of_stock_count`: Productos con `available_quantity = 0`
- `overstock_count`: Productos con `available_quantity > max_stock` (solo si `max_stock` está definido)
- `total_inventory_value`: Valor total del inventario (`SUM(available_quantity * price)`)
- `total_units`: Suma total de unidades en stock (`SUM(available_quantity)`)
- `sales_today`: Ventas de hoy (movimientos tipo `EXIT` donde `DATE(movement_date) = CURRENT_DATE`)
  - `units`: Total de unidades vendidas
  - `amount`: Monto total en COP (calcular sumando `quantity * price` de cada producto)
  - `transactions`: Número de movimientos de salida
- `sales_this_week`: Ventas de los últimos 7 días (misma estructura que `sales_today`)

### `recent_activities`
Lista de actividades recientes combinadas de múltiples fuentes. Máximo 20 actividades, ordenadas por `timestamp` DESC.

**Tipos de actividad:**
- `check_in`: Cliente ingresó al gimnasio (de tabla `attendances`)
- `payment_received`: Se recibió un pago (de tabla `payments`)
- `client_registration`: Nuevo cliente registrado (de tabla `clients`)
- `subscription_created`: Nueva suscripción creada (de tabla `subscriptions`)

**Estructura de cada actividad:**
- `id`: ID único de la actividad (puede ser el ID del registro original o generar uno)
- `type`: Tipo de actividad (uno de los tipos arriba)
- `description`: Descripción legible para humanos (ej: "Juan Pérez ingresó al gimnasio")
- `timestamp`: Fecha/hora en ISO 8601 UTC (`YYYY-MM-DDTHH:mm:ssZ`)
- `client_id`: UUID del cliente (opcional para algunas actividades)
- `client_name`: Nombre completo del cliente (opcional)
- `metadata`: Objeto con información adicional según el tipo:
  - Para `check_in`: `{ attendance_id }`
  - Para `payment_received`: `{ payment_id, amount, method }`
  - Para `subscription_created`: `{ subscription_id, plan_name }`

### `alerts`
Lista de alertas del sistema que requieren atención.

**Tipos de alerta:**
- `low_stock`: Productos con stock bajo
- `out_of_stock`: Productos sin stock
- `subscriptions_expiring`: Suscripciones próximas a vencer
- `pending_debt`: Suscripciones con pagos pendientes

**Estructura de cada alerta:**
- `type`: Tipo de alerta
- `severity`: Nivel de severidad (`error`, `warning`, `info`)
- `message`: Mensaje descriptivo
- `count`: Número de items afectados
- `total_amount`: Monto total (solo para `pending_debt`, string decimal)

### `generated_at`
Timestamp ISO 8601 UTC de cuándo se generó la respuesta.

## Queries SQL Sugeridas

**Nota:** Adaptar según el ORM/DB usado (SQLAlchemy, Django ORM, etc.)

### Clientes

```sql
-- Estadísticas básicas de clientes
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as active,
  COUNT(*) FILTER (WHERE is_active = false) as inactive,
  COUNT(*) FILTER (WHERE created_at >= :period_start AND created_at <= :period_end) as new_this_period,
  COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as new_today,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as new_this_week
FROM clients;

-- Clientes con suscripciones activas
SELECT COUNT(DISTINCT c.id)
FROM clients c
INNER JOIN subscriptions s ON c.id = s.client_id
WHERE s.status = 'active' AND c.is_active = true;

-- Clientes con suscripciones expiradas (sin activas)
SELECT COUNT(DISTINCT c.id)
FROM clients c
INNER JOIN subscriptions s ON c.id = s.client_id
WHERE s.status = 'expired' 
  AND c.id NOT IN (
    SELECT DISTINCT client_id FROM subscriptions WHERE status = 'active'
  );

-- Clientes con pagos pendientes
SELECT COUNT(DISTINCT c.id)
FROM clients c
INNER JOIN subscriptions s ON c.id = s.client_id
WHERE s.status = 'pending_payment';
```

### Suscripciones

```sql
-- Conteo por estado
SELECT 
  status,
  COUNT(*) as count
FROM subscriptions
GROUP BY status;

-- Suscripciones próximas a vencer (próximos 7 días)
SELECT COUNT(*)
FROM subscriptions
WHERE status = 'active' 
  AND end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days';

-- Suscripciones expiradas recientemente (últimos 7 días)
SELECT COUNT(*)
FROM subscriptions
WHERE status = 'expired'
  AND end_date BETWEEN CURRENT_DATE - INTERVAL '7 days' AND CURRENT_DATE;
```

### Finanzas

```sql
-- Ingresos del período
SELECT 
  COALESCE(SUM(amount::numeric), 0) as period_revenue,
  COUNT(*) as total_payments_count,
  COUNT(*) FILTER (WHERE DATE(payment_date) = CURRENT_DATE) as payments_today
FROM payments
WHERE payment_date >= :period_start AND payment_date <= :period_end;

-- Ingresos de hoy
SELECT COALESCE(SUM(amount::numeric), 0) as revenue_today
FROM payments
WHERE DATE(payment_date) = CURRENT_DATE;

-- Ingresos de esta semana
SELECT COALESCE(SUM(amount::numeric), 0) as revenue_this_week
FROM payments
WHERE payment_date >= DATE_TRUNC('week', CURRENT_DATE);

-- Ingresos de este mes
SELECT COALESCE(SUM(amount::numeric), 0) as revenue_this_month
FROM payments
WHERE payment_date >= DATE_TRUNC('month', CURRENT_DATE);

-- Ingresos por método de pago
SELECT 
  payment_method,
  COALESCE(SUM(amount::numeric), 0) as total
FROM payments
WHERE payment_date >= :period_start AND payment_date <= :period_end
GROUP BY payment_method;

-- Deuda pendiente
WITH subscription_totals AS (
  SELECT 
    s.id as subscription_id,
    s.client_id,
    p.price::numeric as subscription_price,
    COALESCE(SUM(pay.amount::numeric), 0) as total_paid
  FROM subscriptions s
  INNER JOIN plans p ON s.plan_id = p.id
  LEFT JOIN payments pay ON s.id = pay.subscription_id
  WHERE s.status = 'pending_payment'
  GROUP BY s.id, s.client_id, p.price
)
SELECT 
  COUNT(*) as debt_count,
  COALESCE(SUM(GREATEST(0, subscription_price - total_paid)), 0) as pending_debt
FROM subscription_totals;
```

### Asistencias

```sql
-- Estadísticas básicas de asistencias
SELECT 
  COUNT(*) FILTER (WHERE DATE(check_in) = CURRENT_DATE) as today,
  COUNT(*) FILTER (WHERE check_in >= DATE_TRUNC('week', CURRENT_DATE)) as this_week,
  COUNT(*) FILTER (WHERE check_in >= DATE_TRUNC('month', CURRENT_DATE)) as this_month,
  COUNT(*) FILTER (WHERE check_in >= :period_start AND check_in <= :period_end) as this_period,
  COUNT(DISTINCT client_id) FILTER (WHERE check_in >= :period_start AND check_in <= :period_end) as unique_visitors
FROM attendances;

-- Hora pico (hora con más asistencias)
SELECT 
  EXTRACT(HOUR FROM check_in)::int as hour,
  COUNT(*) as count
FROM attendances
WHERE check_in >= :period_start AND check_in <= :period_end
GROUP BY EXTRACT(HOUR FROM check_in)
ORDER BY count DESC
LIMIT 1;

-- Promedio diario
SELECT 
  COUNT(*)::numeric / GREATEST(1, :period_days) as average_daily
FROM attendances
WHERE check_in >= :period_start AND check_in <= :period_end;
```

### Inventario

```sql
-- Pueden reutilizar la lógica del endpoint existente /inventory/reports/stats
-- O ejecutar queries similares:

-- Estadísticas básicas
SELECT 
  COUNT(*) as total_products,
  COUNT(*) FILTER (WHERE is_active = true) as active_products,
  COUNT(*) FILTER (WHERE available_quantity <= min_stock) as low_stock_count,
  COUNT(*) FILTER (WHERE available_quantity = 0) as out_of_stock_count,
  COUNT(*) FILTER (WHERE max_stock IS NOT NULL AND available_quantity > max_stock) as overstock_count,
  COALESCE(SUM(available_quantity * price::numeric), 0) as total_inventory_value,
  COALESCE(SUM(available_quantity), 0) as total_units
FROM products;

-- Ventas de hoy (movimientos EXIT)
SELECT 
  COUNT(*) as transactions,
  SUM(ABS(im.quantity)) as units,
  COALESCE(SUM(ABS(im.quantity) * p.price::numeric), 0) as amount
FROM inventory_movements im
INNER JOIN products p ON im.product_id = p.id
WHERE im.movement_type = 'EXIT'
  AND DATE(im.movement_date) = CURRENT_DATE;

-- Ventas de esta semana
SELECT 
  COUNT(*) as transactions,
  SUM(ABS(im.quantity)) as units,
  COALESCE(SUM(ABS(im.quantity) * p.price::numeric), 0) as amount
FROM inventory_movements im
INNER JOIN products p ON im.product_id = p.id
WHERE im.movement_type = 'EXIT'
  AND im.movement_date >= DATE_TRUNC('week', CURRENT_DATE);
```

### Actividades Recientes

```sql
-- Unión de actividades recientes de múltiples fuentes
(
  -- Check-ins recientes
  SELECT 
    CONCAT('check_in_', a.id) as id,
    'check_in' as type,
    CONCAT(c.first_name, ' ', c.last_name, ' ingresó al gimnasio') as description,
    a.check_in as timestamp,
    a.client_id,
    CONCAT(c.first_name, ' ', c.last_name) as client_name,
    jsonb_build_object('attendance_id', a.id) as metadata
  FROM attendances a
  INNER JOIN clients c ON a.client_id = c.id
  WHERE a.check_in >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
  
  UNION ALL
  
  -- Pagos recientes
  SELECT 
    CONCAT('payment_', p.id) as id,
    'payment_received' as type,
    CONCAT(c.first_name, ' ', c.last_name, ' realizó un pago de $', p.amount) as description,
    p.payment_date as timestamp,
    s.client_id,
    CONCAT(c.first_name, ' ', c.last_name) as client_name,
    jsonb_build_object(
      'payment_id', p.id,
      'amount', p.amount,
      'method', p.payment_method
    ) as metadata
  FROM payments p
  INNER JOIN subscriptions s ON p.subscription_id = s.id
  INNER JOIN clients c ON s.client_id = c.id
  WHERE p.payment_date >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
  
  UNION ALL
  
  -- Nuevos registros de clientes
  SELECT 
    CONCAT('client_', c.id) as id,
    'client_registration' as type,
    CONCAT('Nuevo cliente registrado: ', c.first_name, ' ', c.last_name) as description,
    c.created_at as timestamp,
    c.id as client_id,
    CONCAT(c.first_name, ' ', c.last_name) as client_name,
    '{}'::jsonb as metadata
  FROM clients c
  WHERE c.created_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
  
  UNION ALL
  
  -- Nuevas suscripciones
  SELECT 
    CONCAT('subscription_', s.id) as id,
    'subscription_created' as type,
    CONCAT('Nueva suscripción creada para ', c.first_name, ' ', c.last_name) as description,
    s.created_at as timestamp,
    s.client_id,
    CONCAT(c.first_name, ' ', c.last_name) as client_name,
    jsonb_build_object(
      'subscription_id', s.id,
      'plan_name', pl.name
    ) as metadata
  FROM subscriptions s
  INNER JOIN clients c ON s.client_id = c.id
  INNER JOIN plans pl ON s.plan_id = pl.id
  WHERE s.created_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
)
ORDER BY timestamp DESC
LIMIT 20;
```

## Consideraciones de Rendimiento

1. **Caching**: Considerar cachear la respuesta durante 2-5 minutos usando Redis o similar
2. **Índices**: Asegurar que existan índices en:
   - `clients.created_at`, `clients.is_active`
   - `subscriptions.status`, `subscriptions.end_date`
   - `payments.payment_date`, `payments.payment_method`
   - `attendances.check_in`, `attendances.client_id`
   - `inventory_movements.movement_date`, `inventory_movements.movement_type`
3. **Optimización**: Usar CTEs y subqueries eficientes. Considerar materializar resultados parciales si es necesario
4. **Paralelización**: Si es posible, ejecutar queries independientes en paralelo (clientes, suscripciones, finanzas pueden ejecutarse simultáneamente)

## Ejemplo de Implementación FastAPI

```python
from fastapi import APIRouter, Depends, Query
from datetime import datetime, timedelta
from typing import Optional
from decimal import Decimal

router = APIRouter(prefix="/api/v1", tags=["statistics"])

@router.get("/statistics")
async def get_statistics(
    period: str = Query(default="month", regex="^(today|week|month|year)$"),
    date: Optional[str] = Query(default=None, regex="^\d{4}-\d{2}-\d{2}$"),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Get comprehensive statistics for admin dashboard.
    
    - **period**: Analysis period (today, week, month, year)
    - **date**: Reference date in YYYY-MM-DD format (defaults to today)
    """
    # Calcular fechas del período
    ref_date = datetime.strptime(date, "%Y-%m-%d").date() if date else datetime.now().date()
    period_dates = calculate_period_dates(period, ref_date)
    
    # Ejecutar queries en paralelo si es posible
    client_stats = get_client_stats(period_dates)
    subscription_stats = get_subscription_stats(period_dates)
    financial_stats = get_financial_stats(period_dates)
    attendance_stats = get_attendance_stats(period_dates)
    inventory_stats = get_inventory_stats(period_dates)
    recent_activities = get_recent_activities()
    alerts = generate_alerts(subscription_stats, inventory_stats, financial_stats)
    
    return {
        "period": {
            "type": period,
            "start_date": period_dates["start"].isoformat(),
            "end_date": period_dates["end"].isoformat(),
            "reference_date": ref_date.isoformat()
        },
        "client_stats": client_stats,
        "subscription_stats": subscription_stats,
        "financial_stats": financial_stats,
        "attendance_stats": attendance_stats,
        "inventory_stats": inventory_stats,
        "recent_activities": recent_activities,
        "alerts": alerts,
        "generated_at": datetime.utcnow().isoformat() + "Z"
    }

def calculate_period_dates(period: str, ref_date: date) -> dict:
    """Calculate start and end dates for the period."""
    today = date.today()
    
    if period == "today":
        return {"start": ref_date, "end": ref_date}
    elif period == "week":
        # Semana que contiene ref_date (lunes a domingo)
        days_since_monday = ref_date.weekday()
        start = ref_date - timedelta(days=days_since_monday)
        return {"start": start, "end": start + timedelta(days=6)}
    elif period == "month":
        start = ref_date.replace(day=1)
        if ref_date.month == 12:
            end = date(ref_date.year + 1, 1, 1) - timedelta(days=1)
        else:
            end = date(ref_date.year, ref_date.month + 1, 1) - timedelta(days=1)
        return {"start": start, "end": end}
    elif period == "year":
        start = date(ref_date.year, 1, 1)
        end = date(ref_date.year, 12, 31)
        return {"start": start, "end": end}
```

## Testing

Incluir tests para:
1. Verificar cálculos correctos de períodos
2. Validar conteos y sumas
3. Verificar filtrado por fechas
4. Testear con datos vacíos
5. Testear con períodos en límites de meses/años
6. Verificar autenticación y autorización

## Notas Finales

- Todos los montos monetarios deben retornarse como **strings decimales** con 2 decimales
- Todas las fechas deben estar en formato ISO 8601 (UTC para timestamps)
- El endpoint debe ser **rápido** (< 300ms en producción con datos reales)
- Considerar agregar un endpoint de salud `/api/v1/statistics/health` para monitorear performance
- Documentar en OpenAPI/Swagger con ejemplos de respuesta

