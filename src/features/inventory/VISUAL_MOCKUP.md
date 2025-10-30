# 🎨 Mockup Visual - Interfaz de Inventario Mejorada

## Vista Principal con Filtros Expandidos

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║                                                                                  ║
║  📦 Productos                                           [≡ Table] [⊞ Cards]  [+ Nuevo Producto]  ║
║  124 productos • Todos                                                           ║
║                                                                                  ║
╠══════════════════════════════════════════════════════════════════════════════════╣
║                                                                                  ║
║  [🔍 Buscar productos...                                              ]  [≡ Filtros ¹]  ║
║                                                                                  ║
║  ┌────────────────────────────────────────────────────────────────────────────┐ ║
║  │ MOSTRAR                                                                    │ ║
║  │  [● Todos (124)]  [ Sin stock (8) ]  [ Stock bajo (15) ]  [ Activos (120) ]  │ ║
║  │                                                                            │ ║
║  │ ORDENAR POR                                                                │ ║
║  │  [● Nombre A-Z]  [ Nombre Z-A ]  [ Stock menor ]  [ Stock mayor ]         │ ║
║  └────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                  ║
╠══════════════════════════════════════════════════════════════════════════════════╣
║                                                                                  ║
║  ┌─────────────────────────────────────────────────────────────────────────────┐║
║  │ PRODUCTO                    │ PRECIO      │ STOCK                │ ACCIONES │║
║  ├─────────────────────────────┼─────────────┼──────────────────────┼──────────┤║
║  │ 📦 Proteína Whey           │ $120,000    │ 50 / 10 / 100        │          │║
║  │    1kg                     │             │ Actual / Mín / Máx   │ [Gestionar Stock] │║
║  │                            │             │ ✓ Normal             │ [👁] [✎] [🗑] │║
║  ├─────────────────────────────┼─────────────┼──────────────────────┼──────────┤║
║  │ 📦 Creatina Monohidratada  │ $85,000     │ 8 / 10 / 80          │          │║
║  │    500g                    │             │ Actual / Mín / Máx   │ [Gestionar Stock] │║
║  │                            │             │ ⚠ Bajo               │ [👁] [✎] [🗑] │║
║  ├─────────────────────────────┼─────────────┼──────────────────────┼──────────┤║
║  │ 📦 Aminoácidos BCAA        │ $95,000     │ 0 / 5 / 50           │          │║
║  │    300g                    │             │ Actual / Mín / Máx   │ [Gestionar Stock] │║
║  │                            │             │ ✕ Sin stock          │ [👁] [✎] [🗑] │║
║  ├─────────────────────────────┼─────────────┼──────────────────────┼──────────┤║
║  │ 📦 Pre-Entreno Nitro       │ $78,000     │ 35 / 8 / 60          │          │║
║  │    250g                    │             │ Actual / Mín / Máx   │ [Gestionar Stock] │║
║  │                            │             │ ✓ Normal             │ [👁] [✎] [🗑] │║
║  ├─────────────────────────────┼─────────────┼──────────────────────┼──────────┤║
║  │ 📦 Glutamina               │ $65,000     │ 12 / 10 / 80         │          │║
║  │    300g                    │             │ Actual / Mín / Máx   │ [Gestionar Stock] │║
║  │                            │             │ ✓ Normal             │ [👁] [✎] [🗑] │║
║  ├─────────────────────────────┼─────────────┼──────────────────────┼──────────┤║
║  │ 📦 Quemador de Grasa       │ $110,000    │ 3 / 5 / 40           │          │║
║  │    60 cápsulas             │             │ Actual / Mín / Máx   │ [Gestionar Stock] │║
║  │                            │             │ ⚠ Bajo               │ [👁] [✎] [🗑] │║
║  ├─────────────────────────────┼─────────────┼──────────────────────┼──────────┤║
║  │ 📦 Proteína Vegana         │ $95,000     │ 22 / 8 / 50          │          │║
║  │    750g                    │             │ Actual / Mín / Máx   │ [Gestionar Stock] │║
║  │                            │             │ ✓ Normal             │ [👁] [✎] [🗑] │║
║  ├─────────────────────────────┼─────────────┼──────────────────────┼──────────┤║
║  │ 📦 Colágeno Hidrolizado    │ $72,000     │ 18 / 12 / 70         │          │║
║  │    400g                    │             │ Actual / Mín / Máx   │ [Gestionar Stock] │║
║  │                            │             │ ✓ Normal             │ [👁] [✎] [🗑] │║
║  └─────────────────────────────┴─────────────┴──────────────────────┴──────────┘║
║                                                                                  ║
╚══════════════════════════════════════════════════════════════════════════════════╝
```

## Vista de Tarjetas (Cards View)

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║                                                                                  ║
║  📦 Productos                                           [≡ Table] [● Cards]  [+ Nuevo Producto]  ║
║  8 productos • Sin stock                                                         ║
║                                                                                  ║
╠══════════════════════════════════════════════════════════════════════════════════╣
║                                                                                  ║
║  [🔍 creatina                                                     ✕ ]  [≡ Filtros ¹]  ║
║                                                                                  ║
╠══════════════════════════════════════════════════════════════════════════════════╣
║                                                                                  ║
║  ┌───────────────────────────────────────┐  ┌───────────────────────────────────┐  ║
║  │  📦  Creatina Monohidratada          │  │  📦  Creatina Micronizada        │  ║
║  │                                       │  │                                   │  ║
║  │      500g • $85,000                  │  │      300g • $65,000              │  ║
║  │                                       │  │                                   │  ║
║  │      Stock: 8 / 10 / 80  ⚠ Bajo     │  │      Stock: 15 / 10 / 60  ✓ Normal│  ║
║  │                                       │  │                                   │  ║
║  │      [Gestionar Stock] [👁] [✎] [🗑]  │  │      [Gestionar Stock] [👁] [✎] [🗑]│  ║
║  └───────────────────────────────────────┘  └───────────────────────────────────┘  ║
║                                                                                  ║
║  ┌───────────────────────────────────────┐  ┌───────────────────────────────────┐  ║
║  │  📦  Creatina HCL                    │  │  📦  Creatina + Glutamina        │  ║
║  │                                       │  │                                   │  ║
║  │      250g • $78,000                  │  │      600g • $95,000              │  ║
║  │                                       │  │                                   │  ║
║  │      Stock: 0 / 5 / 40  ✕ Sin stock │  │      Stock: 25 / 15 / 80  ✓ Normal│  ║
║  │                                       │  │                                   │  ║
║  │      [Gestionar Stock] [👁] [✎] [🗑]  │  │      [Gestionar Stock] [👁] [✎] [🗑]│  ║
║  └───────────────────────────────────────┘  └───────────────────────────────────┘  ║
║                                                                                  ║
╚══════════════════════════════════════════════════════════════════════════════════╝
```

## Vista Compacta - Solo Sin Stock

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║                                                                                  ║
║  📦 Productos                                           [● Table] [⊞ Cards]  [+ Nuevo Producto]  ║
║  8 productos • Sin stock                                                         ║
║                                                                                  ║
╠══════════════════════════════════════════════════════════════════════════════════╣
║                                                                                  ║
║  [🔍 Buscar productos...                                              ]  [● Filtros ¹]  ║
║                                                                                  ║
║  ┌────────────────────────────────────────────────────────────────────────────┐ ║
║  │ MOSTRAR                                                                    │ ║
║  │  [ Todos (124) ]  [● Sin stock (8) ]  [ Stock bajo (15) ]  [ Activos (120) ] │ ║
║  └────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                  ║
╠══════════════════════════════════════════════════════════════════════════════════╣
║                                                                                  ║
║  ┌─────────────────────────────────────────────────────────────────────────────┐║
║  │ PRODUCTO                    │ PRECIO      │ STOCK                │ ACCIONES │║
║  ├─────────────────────────────┼─────────────┼──────────────────────┼──────────┤║
║  │ 📦 Aminoácidos BCAA        │ $95,000     │ 0 / 5 / 50           │          │║
║  │    300g                    │             │ Actual / Mín / Máx   │ [Gestionar Stock] │║
║  │                            │             │ ✕ Sin stock          │ [👁] [✎] [🗑] │║
║  ├─────────────────────────────┼─────────────┼──────────────────────┼──────────┤║
║  │ 📦 Creatina HCL            │ $78,000     │ 0 / 5 / 40           │          │║
║  │    250g                    │             │ Actual / Mín / Máx   │ [Gestionar Stock] │║
║  │                            │             │ ✕ Sin stock          │ [👁] [✎] [🗑] │║
║  ├─────────────────────────────┼─────────────┼──────────────────────┼──────────┤║
║  │ 📦 Vitamina D3             │ $45,000     │ 0 / 10 / 100         │          │║
║  │    60 cápsulas             │             │ Actual / Mín / Máx   │ [Gestionar Stock] │║
║  │                            │             │ ✕ Sin stock          │ [👁] [✎] [🗑] │║
║  ├─────────────────────────────┼─────────────┼──────────────────────┼──────────┤║
║  │ 📦 Magnesio                │ $38,000     │ 0 / 8 / 70           │          │║
║  │    90 tabletas             │             │ Actual / Mín / Máx   │ [Gestionar Stock] │║
║  │                            │             │ ✕ Sin stock          │ [👁] [✎] [🗑] │║
║  └─────────────────────────────┴─────────────┴──────────────────────┴──────────┘║
║                                                                                  ║
╚══════════════════════════════════════════════════════════════════════════════════╝
```

## Estado Vacío (Empty State)

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║                                                                                  ║
║  📦 Productos                                           [≡ Table] [⊞ Cards]  [+ Nuevo Producto]  ║
║  0 productos                                                                     ║
║                                                                                  ║
╠══════════════════════════════════════════════════════════════════════════════════╣
║                                                                                  ║
║  [🔍 Buscar productos...                                              ]  [≡ Filtros]  ║
║                                                                                  ║
╠══════════════════════════════════════════════════════════════════════════════════╣
║                                                                                  ║
║                                                                                  ║
║                           ┌─────────────────────────┐                           ║
║                           │                         │                           ║
║                           │         📦              │                           ║
║                           │                         │                           ║
║                           │  No hay productos       │                           ║
║                           │     registrados         │                           ║
║                           │                         │                           ║
║                           │  Comienza agregando tu  │                           ║
║                           │  primer producto al     │                           ║
║                           │     inventario          │                           ║
║                           │                         │                           ║
║                           │   [+ Crear primer       │                           ║
║                           │      producto]          │                           ║
║                           │                         │                           ║
║                           └─────────────────────────┘                           ║
║                                                                                  ║
║                                                                                  ║
╚══════════════════════════════════════════════════════════════════════════════════╝
```

## Filtros Colapsados

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║                                                                                  ║
║  [🔍 proteína                                                     ✕ ]  [ Filtros]  ║
║                                                                                  ║
╠══════════════════════════════════════════════════════════════════════════════════╣
```

## Badges de Estado (Close-up)

```
┌──────────────────────────────────────┐
│ ✓ Normal     ← Verde suave          │
│ ⚠ Bajo       ← Amarillo             │
│ ✕ Sin stock  ← Rojo                 │
│ ↗ Exceso     ← Azul                 │
└──────────────────────────────────────┘
```

## Botones de Acción (Close-up)

```
┌─────────────────────────────────────────────────────────┐
│  Primaria:   [⚙ Gestionar Stock]  ← Rojo PowerGym     │
│  Secundaria: [👁 Historial] [✎ Editar]  ← Outline    │
│  Terciaria:  [🗑]  ← Ghost rojo                       │
└─────────────────────────────────────────────────────────┘
```

## Comparación: Antes vs Después

### ANTES (ProductList)
```
┌────────────────────────────────────────┐
│  📦 Proteína Whey                     │ ← Card grande
│     1kg                                │   
│     "Suplemento de alta calidad..."    │   Mucho padding
│                                        │
│     Precio: $120,000                   │
│     Stock Actual: 50                   │   Info distribuida
│     Stock Mínimo: 10                   │   en columnas
│     Stock Máximo: 100                  │
│                                        │
│     [Gestionar] [Historial]           │
│     [Editar] [Eliminar]               │
│                             ✓ Normal   │ ← Estado lejos
└────────────────────────────────────────┘

Altura: ~250px por card
Productos visibles: 3-4
```

### DESPUÉS (ProductListImproved - Tabla)
```
│ 📦 Proteína Whey  │ $120,000 │ 50/10/100 ✓Normal │ [Gestionar][👁][✎][🗑] │
│    1kg            │          │ Actual/Mín/Máx    │                        │

Altura: ~60px por fila
Productos visibles: 8-10
Info más compacta y escaneable ✓
```

## 🎨 Paleta de Colores Real

```css
/* Rojo PowerGym */
#E60000 → Botón Gestionar Stock

/* Estados */
bg-green-50 + text-green-700  → Stock Normal
bg-yellow-50 + text-yellow-700 → Stock Bajo  
bg-red-50 + text-red-700      → Sin Stock
bg-blue-50 + text-blue-700    → Sobrestock

/* Neutral */
bg-gray-50  → Backgrounds alternos
bg-gray-100 → Toggle buttons inactive
bg-white    → Cards, inputs
```

## 📱 Responsive

### Mobile (< 640px)
- Vista cards: 1 columna
- Vista tabla: Scroll horizontal
- Filtros apilados verticalmente

### Tablet (640px - 1024px)
- Vista cards: 1-2 columnas
- Vista tabla: Ajustada
- Botones de acción compactos

### Desktop (> 1024px)
- Vista cards: 2 columnas
- Vista tabla: Completa con todos los detalles
- Experiencia óptima

---

**Resumen**: Diseño minimalista, compacto y eficiente que maximiza la información visible mientras mantiene claridad visual.

