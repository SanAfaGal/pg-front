# Plan de Refactorización - Módulo Inventory

## 📊 Análisis de la Estructura Actual

### Estructura de Carpetas
```
inventory/
├── api/
│   └── inventoryApi.ts           # ✅ Bien estructurado
├── components/
│   ├── InventoryReports.tsx      # ⚠️ Muy grande (587 líneas)
│   ├── MovementList.tsx          # ✅ Tamaño razonable
│   ├── ProductForm.tsx           # ⚠️ Grande (429 líneas)
│   ├── ProductHistoryModal.tsx   # ✅ Tamaño razonable
│   ├── ProductList.tsx           # ❌ DEPRECADO - usar ProductListImproved
│   ├── ProductListImproved.tsx   # ⚠️ Muy grande (670 líneas)
│   └── StockManagement.tsx       # ✅ Tamaño razonable
├── hooks/
│   ├── index.ts                  # ✅ Exportaciones limpias
│   ├── useMovements.ts
│   ├── useProducts.ts
│   ├── useReports.ts
│   └── useStock.ts
├── pages/
│   └── InventoryPage.tsx         # ✅ Bien estructurado
├── types/
│   └── index.ts                  # ✅ Tipos centralizados
└── index.ts                      # ✅ Exportaciones principales
```

---

## 🔍 Problemas Identificados

### 1. **Duplicación de Código** 🔴 CRÍTICO

#### A. Funciones de Formateo (5+ repeticiones)
```typescript
// Se repite en: ProductList, ProductListImproved, ProductForm, 
// InventoryReports, ProductHistoryModal, StockManagement

formatCurrency(amount, currency) // 6 veces
formatQuantity(quantity, unit?)   // 5 veces
formatDate(date)                  // 3 veces
```

#### B. Componentes Visuales (3+ repeticiones)
```typescript
// ProductImage/ImagePreview - 5 veces con variaciones
// StockStatusBadge - 2 veces (ProductList y ProductListImproved)
// MovementTypeIcon - 2 veces
```

#### C. Lógica de Negocio Duplicada
```typescript
// Cálculo de stock status
// Validación de imágenes
// Parseo de cantidades
```

---

### 2. **Componentes Gigantes** 🟡 MEDIO

- **ProductListImproved.tsx**: 670 líneas
  - Contiene: Filtros, ordenación, vista tabla, vista cards
  - Debería dividirse en sub-componentes

- **InventoryReports.tsx**: 587 líneas
  - Contiene múltiples tabs y vistas
  - Debería dividirse por tab/funcionalidad

- **ProductForm.tsx**: 429 líneas
  - Formulario con muchas secciones
  - Cada sección podría ser un sub-componente

---

### 3. **Falta de Separación de Responsabilidades** 🟡 MEDIO

- Componentes mezclan UI + lógica de formateo
- No hay capa de utilidades para funciones comunes
- Falta de constantes compartidas (ej: UNIT_TYPES, CURRENCIES)

---

### 4. **ProductList.tsx Obsoleto** 🟠 MENOR

- Existe ProductList.tsx y ProductListImproved.tsx
- ProductList.tsx está deprecado pero no eliminado
- Causa confusión en el código

---

## 🎯 Objetivos de la Refactorización

### Prioridad ALTA 🔴
1. ✅ Eliminar duplicación de funciones de formateo
2. ✅ Extraer componentes visuales reutilizables
3. ✅ Crear capa de utilidades (`utils/`)
4. ✅ Centralizar constantes

### Prioridad MEDIA 🟡
5. ✅ Dividir componentes grandes
6. ✅ Eliminar ProductList.tsx obsoleto
7. ✅ Mejorar estructura de carpetas

### Prioridad BAJA 🟢
8. ✅ Documentar código
9. ✅ Agregar comentarios JSDoc
10. ✅ Optimizaciones menores

---

## 📐 Nueva Estructura Propuesta

```
inventory/
├── api/
│   └── inventoryApi.ts
├── components/
│   ├── common/                    # 🆕 Componentes reutilizables
│   │   ├── ProductImage.tsx
│   │   ├── StockBadge.tsx
│   │   ├── MovementTypeIcon.tsx
│   │   └── LoadingState.tsx
│   ├── forms/                     # 🆕 Formularios
│   │   └── ProductForm/
│   │       ├── index.tsx
│   │       ├── BasicInfoSection.tsx
│   │       ├── PricingSection.tsx
│   │       ├── StockConfigSection.tsx
│   │       └── ImageSection.tsx
│   ├── lists/                     # 🆕 Listas y tablas
│   │   ├── ProductList/
│   │   │   ├── index.tsx
│   │   │   ├── ProductTable.tsx
│   │   │   ├── ProductCards.tsx
│   │   │   └── ProductFilters.tsx
│   │   └── MovementList.tsx
│   ├── modals/                    # 🆕 Modales
│   │   ├── ProductHistoryModal.tsx
│   │   └── StockManagement.tsx
│   └── reports/                   # 🆕 Reportes
│       └── InventoryReports/
│           ├── index.tsx
│           ├── OverviewTab.tsx
│           ├── SalesTab.tsx
│           └── ReconciliationTab.tsx
├── constants/                     # 🆕 Constantes
│   ├── productConstants.ts
│   └── formatters.ts
├── hooks/
│   ├── index.ts
│   ├── useMovements.ts
│   ├── useProducts.ts
│   ├── useReports.ts
│   └── useStock.ts
├── pages/
│   └── InventoryPage.tsx
├── types/
│   └── index.ts
├── utils/                         # 🆕 Utilidades
│   ├── formatters.ts              # formatCurrency, formatQuantity, formatDate
│   ├── imageHelpers.ts            # handleImageError, getImageUrl
│   └── stockHelpers.ts            # calculateStockStatus, etc.
└── index.ts
```

---

## 🔧 Plan de Implementación

### FASE 1: Crear Infraestructura Base ✅

**1.1 Crear carpeta utils/ y funciones de formateo**
```typescript
// utils/formatters.ts
export const formatCurrency(amount: string | number, currency: string): string
export const formatQuantity(quantity: string | number, unit?: string): string
export const formatDate(date: string | Date, format?: string): string
```

**1.2 Crear carpeta constants/**
```typescript
// constants/productConstants.ts
export const UNIT_TYPES: UnitType[]
export const CURRENCIES: Currency[]
export const DOCUMENT_TYPES: DocumentType[]
```

**1.3 Crear carpeta components/common/**
```typescript
// components/common/ProductImage.tsx
export const ProductImage: FC<ProductImageProps>

// components/common/StockBadge.tsx
export const StockBadge: FC<StockBadgeProps>

// components/common/MovementTypeIcon.tsx
export const MovementTypeIcon: FC<MovementTypeIconProps>
```

---

### FASE 2: Refactorizar Componentes Existentes ✅

**2.1 ProductListImproved**
- Extraer ProductFilters como componente separado
- Extraer ProductTable como componente separado
- Extraer ProductCards como componente separado
- Usar funciones de utils/formatters

**2.2 ProductForm**
- Dividir en secciones (BasicInfo, Pricing, StockConfig, Image)
- Usar constantes centralizadas
- Usar funciones de utils/formatters

**2.3 InventoryReports**
- Dividir en tabs separados (Overview, Sales, Reconciliation)
- Extraer lógica de formateo
- Usar componentes comunes

**2.4 ProductHistoryModal, StockManagement, MovementList**
- Reemplazar funciones duplicadas por utils/
- Usar componentes comunes (ProductImage, etc.)

---

### FASE 3: Limpieza y Optimización ✅

**3.1 Eliminar código obsoleto**
- Eliminar ProductList.tsx (usar solo ProductListImproved)
- Actualizar imports en toda la app

**3.2 Actualizar exports**
- Actualizar index.ts con nuevas rutas
- Asegurar exports limpios

**3.3 Documentación**
- Agregar JSDoc a funciones utils
- Comentarios en componentes complejos
- Actualizar README si existe

---

## 📋 Checklist de Cambios

### Utils y Constantes
- [ ] Crear `utils/formatters.ts`
- [ ] Crear `utils/imageHelpers.ts`
- [ ] Crear `utils/stockHelpers.ts`
- [ ] Crear `constants/productConstants.ts`

### Componentes Comunes
- [ ] Crear `components/common/ProductImage.tsx`
- [ ] Crear `components/common/StockBadge.tsx`
- [ ] Crear `components/common/MovementTypeIcon.tsx`
- [ ] Crear `components/common/LoadingState.tsx`

### Refactorizar Componentes Grandes
- [ ] Dividir ProductListImproved
- [ ] Dividir ProductForm
- [ ] Dividir InventoryReports

### Reemplazar Funciones Duplicadas
- [ ] ProductListImproved → usar utils
- [ ] ProductForm → usar utils
- [ ] InventoryReports → usar utils
- [ ] ProductHistoryModal → usar utils
- [ ] StockManagement → usar utils
- [ ] MovementList → usar utils

### Limpieza
- [ ] Eliminar ProductList.tsx
- [ ] Actualizar imports
- [ ] Actualizar exports en index.ts

### Testing y Validación
- [ ] Verificar que no hay errores de lint
- [ ] Verificar que todo compila
- [ ] Probar funcionalidades en UI

---

## 🎯 Métricas de Éxito

### Antes
- ❌ formatCurrency: 6 implementaciones duplicadas
- ❌ formatQuantity: 5 implementaciones duplicadas
- ❌ ProductImage: 5 variaciones diferentes
- ❌ StockBadge: 2 implementaciones
- ❌ 3 componentes > 400 líneas
- ❌ 0 carpetas de organización
- ❌ 1 componente obsoleto

### Después
- ✅ formatCurrency: 1 implementación centralizada
- ✅ formatQuantity: 1 implementación centralizada
- ✅ ProductImage: 1 componente reutilizable
- ✅ StockBadge: 1 componente reutilizable
- ✅ 0 componentes > 300 líneas
- ✅ 5 carpetas de organización (common, forms, lists, modals, reports)
- ✅ 0 componentes obsoletos

---

## ⚠️ Consideraciones Importantes

### NO Cambiar
- ✅ Funcionalidad visible del usuario
- ✅ APIs y endpoints
- ✅ Tipos TypeScript (solo reorganizar si es necesario)
- ✅ Hooks de React Query
- ✅ Flujo de datos

### SÍ Cambiar
- ✅ Estructura de carpetas
- ✅ Importaciones
- ✅ Ubicación de funciones
- ✅ División de componentes
- ✅ Nombres de archivos (si mejora claridad)

---

## 🚀 Próximos Pasos

1. **Revisar y Aprobar Plan** ⏳
2. **Crear Rama de Refactorización** 
3. **Implementar FASE 1** (Infraestructura)
4. **Implementar FASE 2** (Refactorización)
5. **Implementar FASE 3** (Limpieza)
6. **Testing Completo**
7. **Code Review**
8. **Merge a Main**

---

**Tiempo Estimado**: 4-6 horas  
**Impacto en Usuario**: 0% (sin cambios funcionales)  
**Beneficio**: Alta mantenibilidad, código más limpio, menos bugs futuros

