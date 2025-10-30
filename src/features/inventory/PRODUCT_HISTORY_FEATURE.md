# Historial de Movimientos de Productos

## 📋 Resumen

Se ha implementado completamente la funcionalidad para ver el historial de movimientos de cada producto, consumiendo el endpoint `/api/v1/inventory/reports/products/{product_id}/history` y presentando la información de manera clara, profesional y moderna.

## ✨ Características Implementadas

### 1. **API y Hooks** ✅

#### API Function (Ya existía)
```typescript
// src/features/inventory/api/inventoryApi.ts
async getProductHistory(productId: string): Promise<ProductHistory> {
  return apiClient.get<ProductHistory>(
    API_ENDPOINTS.inventory.reports.productHistory(productId)
  );
}
```

#### Custom Hook (Ya existía)
```typescript
// src/features/inventory/hooks/useReports.ts
export const useProductHistory = (productId: string, enabled = true) => {
  return useQuery({
    queryKey: reportKeys.productHistory(productId),
    queryFn: () => inventoryApi.getProductHistory(productId),
    enabled: enabled && !!productId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
```

**Maneja automáticamente:**
- ✅ Loading state
- ✅ Error state
- ✅ Cache con React Query
- ✅ Refetch automático

---

### 2. **Componente ProductHistoryModal** 🆕

Un modal moderno y completo que muestra:

#### Header con Información del Producto:
- Imagen del producto (con fallback automático)
- Nombre y presentación
- Stock actual destacado
- Botón de cerrar

#### Tarjetas de Estadísticas (4 cards):
1. **Total Movimientos** - Ícono azul, cuenta total
2. **Entradas** - Ícono verde, cantidad de entradas + unidades totales
3. **Salidas** - Ícono rojo, cantidad de salidas + unidades totales
4. **Balance Neto** - Ícono morado, diferencia (entradas - salidas)

#### Tabla de Movimientos Recientes:
- Últimos 50 movimientos
- Orden descendente (más reciente primero)
- Columnas:
  - **Fecha**: Con ícono de calendario, formato legible
  - **Tipo**: Badge verde (Entrada) o rojo (Salida) con ícono
  - **Cantidad**: Número con +/- y color semántico
  - **Responsable**: Con ícono de usuario
  - **Notas**: Con ícono de documento, truncado a 2 líneas

#### Estados Especiales:
- **Loading**: Spinner animado con mensaje
- **Error**: Card roja con mensaje descriptivo
- **Sin movimientos**: Empty state con mensaje amigable

---

### 3. **Integración con InventoryPage** ✅

#### Estado agregado:
```typescript
const [showProductHistory, setShowProductHistory] = useState(false);
```

#### Handler actualizado:
```typescript
const handleViewHistory = (product: Product) => {
  setSelectedProduct(product);
  setShowProductHistory(true);
};
```

#### Modal renderizado:
```tsx
{selectedProduct && (
  <ProductHistoryModal
    product={selectedProduct}
    isOpen={showProductHistory}
    onClose={handleCloseProductHistory}
  />
)}
```

---

## 🎨 Diseño y UX

### Inspiración: Linear / Notion / Stripe

#### Paleta de Colores:
```css
/* Stats Cards */
Total Movimientos: bg-blue-100, text-blue-600
Entradas: bg-green-100, text-green-600
Salidas: bg-red-100, text-red-600
Balance Neto: bg-purple-100, text-purple-600

/* Badges en Tabla */
Entrada: bg-green-50, text-green-700, border-green-200
Salida: bg-red-50, text-red-700, border-red-200

/* Estados */
Loading: powergym-blue-medium
Error: red-50/600/700
Empty: gray-100/400/500
```

#### Espaciado y Tipografía:
- Padding moderado: `p-4`, `p-6`
- Gap consistente: `gap-2`, `gap-3`, `gap-4`
- Títulos: `text-xl font-semibold`
- Subtítulos: `text-sm text-gray-600`
- Stats: `text-2xl font-bold`
- Tabla: `text-sm`

#### Efectos y Transiciones:
- Hover en cards: `hover:shadow-md transition-shadow`
- Hover en rows: `hover:bg-gray-50 transition-colors`
- Bordes redondeados: `rounded-lg`, `rounded-xl`
- Sombras sutiles: `shadow-sm`

---

## 📊 Mockup Visual

```
╔════════════════════════════════════════════════════════════════════╗
║                    Historial de Movimientos                    [X] ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  ┌────────────────────────────────────────────────────────────┐   ║
║  │ [IMG] Proteína Whey                                        │   ║
║  │       1kg                                                  │   ║
║  │       Stock actual: 50                                     │   ║
║  └────────────────────────────────────────────────────────────┘   ║
║                                                                    ║
║  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          ║
║  │  TOTAL   │  │ ENTRADAS │  │ SALIDAS  │  │ BALANCE  │          ║
║  │   145    │  │    42    │  │    103   │  │  +320    │          ║
║  │          │  │ +500 und │  │ -180 und │  │          │          ║
║  └──────────┘  └──────────┘  └──────────┘  └──────────┘          ║
║                                                                    ║
║  ┌────────────────────────────────────────────────────────────┐   ║
║  │ Movimientos Recientes (Últimos 50)                         │   ║
║  ├────────┬──────┬─────────┬─────────────┬──────────────────┤   ║
║  │ FECHA  │ TIPO │ CANTID. │ RESPONSABLE │ NOTAS            │   ║
║  ├────────┼──────┼─────────┼─────────────┼──────────────────┤   ║
║  │ 15 Ene │ [↗]  │  +25    │ 📅 juan     │ 📄 Reposición   │   ║
║  │ 12:30  │Entry │         │             │    mensual       │   ║
║  ├────────┼──────┼─────────┼─────────────┼──────────────────┤   ║
║  │ 14 Ene │ [↘]  │  -15    │ 📅 maria    │ 📄 Venta        │   ║
║  │ 18:45  │Exit  │         │             │                  │   ║
║  ├────────┼──────┼─────────┼─────────────┼──────────────────┤   ║
║  │ 13 Ene │ [↘]  │  -8     │ 📅 pedro    │ 📄 Venta        │   ║
║  │ 09:15  │Exit  │         │             │                  │   ║
║  └────────┴──────┴─────────┴─────────────┴──────────────────┘   ║
║                                                                    ║
║                                            [Cerrar]                ║
╚════════════════════════════════════════════════════════════════════╝
```

---

## 🔧 Implementación Técnica

### Componente ProductImage

Maneja automáticamente:
- ✅ Carga de imagen desde URL
- ✅ Fallback a ícono si falla
- ✅ Estado de error con `onError`
- ✅ Proporciones correctas con `object-contain`
- ✅ Fondo blanco limpio

```tsx
const ProductImage: React.FC<ProductImageProps> = ({ url, name }) => {
  const [imageError, setImageError] = React.useState(false);

  if (!url || imageError) {
    return <DefaultIcon />;
  }

  return (
    <img
      src={url}
      alt={name}
      className="max-w-full max-h-full object-contain"
      onError={() => setImageError(true)}
    />
  );
};
```

---

### Componente MovementRow

Renderiza cada fila de movimiento con:
- Fecha formateada con `date-fns`
- Badge de tipo con color semántico
- Cantidad con signo +/-
- Responsable (opcional)
- Notas truncadas (opcional)

```tsx
const MovementRow: React.FC<MovementRowProps> = ({ movement }) => {
  const isEntry = movement.movement_type === 'ENTRY';
  const quantity = parseFloat(movement.quantity);
  const absQuantity = Math.abs(quantity);

  return (
    <tr className="border-b hover:bg-gray-50">
      {/* ... cells ... */}
    </tr>
  );
};
```

---

### Hook useProductHistory

Configuración optimizada:
- **queryKey**: Específica por producto
- **enabled**: Solo se ejecuta cuando el modal está abierto
- **staleTime**: 2 minutos de cache
- **Refetch automático**: Al abrir el modal

```typescript
const { data: history, isLoading, error } = useProductHistory(
  product.id, 
  isOpen
);
```

---

## 📦 Estructura de Datos

### ProductHistory (Response del API):

```typescript
interface ProductHistory {
  product_id: string;
  total_movements: number;
  total_entries: string;      // Sum of quantities
  total_exits: string;         // Sum of quantities
  entries_count: number;       // Count of records
  exits_count: number;         // Count of records
  last_movement?: Movement;
  recent_movements: Movement[]; // Last 50, newest first
}
```

### Movement:

```typescript
interface Movement {
  id: string;
  product_id: string;
  movement_type: 'ENTRY' | 'EXIT';
  quantity: string;
  movement_date: string;       // ISO 8601
  responsible?: string;
  notes?: string;
}
```

---

## 🎯 Casos de Uso Soportados

### 1. Producto con Historial Completo
- ✅ Muestra todas las estadísticas
- ✅ Tabla con movimientos ordenados
- ✅ Paginación implícita (últimos 50)

### 2. Producto Sin Movimientos
- ✅ Empty state con mensaje amigable
- ✅ Sin tabla vacía
- ✅ Stats en cero

### 3. Error al Cargar
- ✅ Card roja con mensaje
- ✅ Descripción del error
- ✅ No rompe la UI

### 4. Carga en Progreso
- ✅ Spinner animado
- ✅ Mensaje de carga
- ✅ Modal se mantiene abierto

---

## 🚀 Flujo de Usuario

```
1. Usuario hace clic en "Ver Historial" en producto
   ↓
2. Modal se abre con loading state
   ↓
3. Se consume el endpoint GET /api/v1/inventory/.../history
   ↓
4. Se renderiza la información:
   - Header con producto
   - 4 cards de estadísticas
   - Tabla de movimientos
   ↓
5. Usuario revisa el historial
   ↓
6. Usuario cierra el modal
   ↓
7. Estado se limpia, cache se mantiene 2 minutos
```

---

## 📊 Formato de Fecha

Usando `date-fns`:

```typescript
const formatDate = (date: string) => {
  return format(new Date(date), "dd MMM yyyy, HH:mm", { locale: es });
};

// Ejemplo: "15 Ene 2025, 12:30"
```

---

## 🎨 Colores Semánticos

| Elemento | Color Principal | Uso |
|---|---|---|
| Total Movimientos | `blue-600` | Información neutral |
| Entradas | `green-600/700` | Incrementos positivos |
| Salidas | `red-600/700` | Decrementos, alertas |
| Balance Neto | `purple-600/700` | Cálculos derivados |
| Error | `red-600` | Estados de error |
| Loading | `powergym-blue-medium` | Estados de carga |

---

## ✅ Checklist de Funcionalidad

- ✅ Endpoint API consumido correctamente
- ✅ Hook con manejo de estados (loading, error, success)
- ✅ Componente modal moderno y profesional
- ✅ Imagen con fallback automático
- ✅ Estadísticas claras y visuales
- ✅ Tabla ordenada por fecha descendente
- ✅ Formato de fecha localizado (español)
- ✅ Colores semánticos en entradas/salidas
- ✅ Empty state para sin movimientos
- ✅ Error handling con mensaje descriptivo
- ✅ Loading state con spinner
- ✅ Responsive design
- ✅ Integrado con InventoryPage
- ✅ Código limpio y escalable
- ✅ Sin linter errors

---

## 📁 Archivos Modificados/Creados

### Creados:
- ✅ `src/features/inventory/components/ProductHistoryModal.tsx` (nuevo)

### Modificados:
- ✅ `src/features/inventory/pages/InventoryPage.tsx`
  - Agregado import de ProductHistoryModal
  - Agregado estado showProductHistory
  - Actualizado handleViewHistory
  - Agregado handleCloseProductHistory
  - Renderizado del modal

### Ya Existían (sin cambios):
- ✅ `src/features/inventory/api/inventoryApi.ts` (getProductHistory)
- ✅ `src/features/inventory/hooks/useReports.ts` (useProductHistory)
- ✅ `src/features/inventory/types/index.ts` (ProductHistory, Movement)

---

## 🎯 Resultado Final

Una funcionalidad **completa, profesional y moderna** para ver el historial de movimientos de productos que:

✅ **Consume el endpoint** correctamente  
✅ **Maneja todos los estados** (loading, error, empty, success)  
✅ **Presenta información clara** con estadísticas visuales  
✅ **Muestra movimientos ordenados** con formato legible  
✅ **Tiene diseño moderno** tipo Linear/Notion/Stripe  
✅ **Es responsive** y escalable  
✅ **Código limpio** y mantenible  
✅ **Sin errores** de linter  

---

## 💡 Mejoras Futuras Sugeridas

1. **Exportación**: Botón para exportar historial a CSV/Excel
2. **Filtros**: Filtrar por tipo, fecha, responsable
3. **Paginación**: Ver más de 50 movimientos
4. **Búsqueda**: Buscar en notas
5. **Gráficas**: Visualización de entradas/salidas en el tiempo
6. **Detalles expandibles**: Click en fila para ver más info
7. **Comparación**: Ver historial de múltiples productos

---

**Fecha**: Octubre 2025  
**Versión**: 1.0  
**Estilo**: Minimalista, inspirado en Linear/Notion/Stripe  
**Estado**: ✅ Completado y funcional

