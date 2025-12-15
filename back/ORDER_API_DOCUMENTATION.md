# API de Órdenes - Productos de Computadoras

## Descripción
CRUD completo para la gestión de órdenes de productos de computadoras, implementado con **Arquitectura Limpia**.

## Estructura del Proyecto (Arquitectura Limpia)

```
back/
├── src/
│   ├── domain/                           # Capa de Dominio (Entidades y Reglas de Negocio)
│   │   ├── entities/
│   │   │   └── order.entity.js          # Entidad Order
│   │   └── repositories/
│   │       └── order.repository.interface.js  # Interfaz del repositorio
│   │
│   ├── application/                      # Capa de Aplicación (Casos de Uso)
│   │   └── use-cases/
│   │       └── order.service.js         # Lógica de negocio de órdenes
│   │
│   ├── infrastructure/                   # Capa de Infraestructura (Implementaciones)
│   │   └── repositories/
│   │       └── database/
│   │           └── mongo/
│   │               ├── models/
│   │               │   └── order.model.js      # Modelo Mongoose
│   │               └── order.mongo.repository.js  # Implementación del repositorio
│   │
│   └── presentation/                     # Capa de Presentación (API REST)
│       ├── controller/
│       │   └── order.controller.js      # Controlador HTTP
│       └── routes/
│           └── order.routes.js          # Rutas y documentación Swagger
```

## Campos de la Entidad Order

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| producto | String | Sí | Nombre del producto de computadora (20 opciones disponibles) |
| descripcion | String | Sí | Descripción detallada del producto |
| cantidad | Number | Sí | Cantidad de productos (mínimo 1) |
| precio | Number | Sí | Precio unitario del producto |
| descuento | Number | No | Descuento en porcentaje (0-100), default: 0 |
| total | Number | Auto | Calculado automáticamente: (precio × cantidad) - descuento |
| cliente | String | Sí | Nombre del cliente |
| estado | String | No | Estado de la orden, default: 'pendiente' |
| fechaEntrega | Date | Sí | Fecha estimada de entrega (no puede ser en el pasado) |

### Productos Disponibles
- Laptop HP Pavilion
- Laptop Dell XPS
- Laptop Lenovo ThinkPad
- Laptop ASUS ROG
- Monitor Samsung 27"
- Monitor LG UltraWide
- Teclado Mecánico Logitech
- Mouse Gamer Razer
- Tarjeta Gráfica NVIDIA RTX 4090
- Tarjeta Gráfica AMD Radeon RX 7900
- Procesador Intel Core i9
- Procesador AMD Ryzen 9
- RAM Corsair 32GB DDR5
- SSD Samsung 1TB NVMe
- Motherboard ASUS ROG
- Fuente de Poder 850W
- Case Gamer RGB
- Webcam Logitech HD
- Auriculares HyperX Cloud
- Impresora HP LaserJet

### Estados Disponibles
- `pendiente` - Orden recién creada
- `procesando` - Orden en proceso
- `enviado` - Orden enviada
- `entregado` - Orden entregada
- `cancelado` - Orden cancelada

## Endpoints de la API

### Base URL
```
http://localhost:8080/api/v1/orders
```

### 1. Obtener todas las órdenes
```http
GET /api/v1/orders
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": "675741234567890abcdef123",
    "producto": "Laptop Dell XPS",
    "descripcion": "Laptop Dell XPS 15 con procesador Intel i7, 16GB RAM, 512GB SSD",
    "cantidad": 2,
    "precio": 1500,
    "descuento": 10,
    "total": 2700,
    "cliente": "Juan Pérez",
    "estado": "pendiente",
    "fechaEntrega": "2025-12-20T00:00:00.000Z"
  }
]
```

### 2. Obtener una orden por ID
```http
GET /api/v1/orders/:id
```

**Parámetros:**
- `id` - ID de la orden

**Respuesta exitosa (200):**
```json
{
  "id": "675741234567890abcdef123",
  "producto": "Tarjeta Gráfica NVIDIA RTX 4090",
  "descripcion": "Tarjeta gráfica de alta gama para gaming y rendering",
  "cantidad": 1,
  "precio": 2000,
  "descuento": 5,
  "total": 1900,
  "cliente": "María González",
  "estado": "procesando",
  "fechaEntrega": "2025-12-25T00:00:00.000Z"
}
```

### 3. Obtener órdenes por estado
```http
GET /api/v1/orders/estado/:estado
```

**Parámetros:**
- `estado` - Estado de las órdenes (pendiente, procesando, enviado, entregado, cancelado)

**Ejemplo:**
```http
GET /api/v1/orders/estado/pendiente
```

### 4. Crear una nueva orden
```http
POST /api/v1/orders
Content-Type: application/json
Authorization: Bearer <token>
```

**Requiere autenticación y rol de administrador**

**Body:**
```json
{
  "producto": "Procesador Intel Core i9",
  "descripcion": "Procesador Intel Core i9-13900K, 24 núcleos, 5.8GHz",
  "cantidad": 3,
  "precio": 600,
  "descuento": 15,
  "cliente": "Carlos Rodríguez",
  "estado": "pendiente",
  "fechaEntrega": "2025-12-30"
}
```

**Respuesta exitosa (201):**
```json
{
  "id": "675741234567890abcdef456",
  "producto": "Procesador Intel Core i9",
  "descripcion": "Procesador Intel Core i9-13900K, 24 núcleos, 5.8GHz",
  "cantidad": 3,
  "precio": 600,
  "descuento": 15,
  "total": 1530,
  "cliente": "Carlos Rodríguez",
  "estado": "pendiente",
  "fechaEntrega": "2025-12-30T00:00:00.000Z"
}
```

### 5. Actualizar una orden
```http
PUT /api/v1/orders/:id
Content-Type: application/json
Authorization: Bearer <token>
```

**Requiere autenticación y rol de administrador**

**Body (todos los campos son opcionales):**
```json
{
  "cantidad": 5,
  "descuento": 20,
  "estado": "procesando"
}
```

**Respuesta exitosa (200):**
```json
{
  "id": "675741234567890abcdef456",
  "producto": "Procesador Intel Core i9",
  "descripcion": "Procesador Intel Core i9-13900K, 24 núcleos, 5.8GHz",
  "cantidad": 5,
  "precio": 600,
  "descuento": 20,
  "total": 2400,
  "cliente": "Carlos Rodríguez",
  "estado": "procesando",
  "fechaEntrega": "2025-12-30T00:00:00.000Z"
}
```

### 6. Cancelar una orden
```http
PATCH /api/v1/orders/:id/cancel
Authorization: Bearer <token>
```

**Requiere autenticación y rol de administrador**

**Respuesta exitosa (200):**
```json
{
  "id": "675741234567890abcdef456",
  "producto": "Procesador Intel Core i9",
  "descripcion": "Procesador Intel Core i9-13900K, 24 núcleos, 5.8GHz",
  "cantidad": 5,
  "precio": 600,
  "descuento": 20,
  "total": 2400,
  "cliente": "Carlos Rodríguez",
  "estado": "cancelado",
  "fechaEntrega": "2025-12-30T00:00:00.000Z"
}
```

### 7. Eliminar una orden
```http
DELETE /api/v1/orders/:id
Authorization: Bearer <token>
```

**Requiere autenticación y rol de administrador**

**Respuesta exitosa (204):** Sin contenido

## Validaciones de Negocio

El servicio implementa las siguientes validaciones:

1. **Cantidad:** Debe ser mayor a 0
2. **Precio:** Debe ser mayor a 0
3. **Descuento:** Debe estar entre 0 y 100
4. **Fecha de entrega:** No puede ser en el pasado
5. **Cancelación:**
   - No se puede cancelar una orden ya entregada
   - No se puede cancelar una orden ya cancelada
6. **Cálculo automático del total:**
   - Total = (Precio × Cantidad) - (Descuento%)

## Ejemplos de Uso con cURL

### Crear una orden
```bash
curl -X POST http://localhost:8080/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "producto": "RAM Corsair 32GB DDR5",
    "descripcion": "Memoria RAM Corsair Vengeance DDR5 32GB 6000MHz",
    "cantidad": 4,
    "precio": 180,
    "descuento": 10,
    "cliente": "Pedro Martínez",
    "fechaEntrega": "2026-01-15"
  }'
```

### Obtener todas las órdenes
```bash
curl -X GET http://localhost:8080/api/v1/orders
```

### Obtener órdenes pendientes
```bash
curl -X GET http://localhost:8080/api/v1/orders/estado/pendiente
```

### Actualizar estado de una orden
```bash
curl -X PUT http://localhost:8080/api/v1/orders/675741234567890abcdef123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "estado": "enviado"
  }'
```

### Cancelar una orden
```bash
curl -X PATCH http://localhost:8080/api/v1/orders/675741234567890abcdef123/cancel \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Swagger Documentation

La documentación interactiva de Swagger está disponible en:
```
http://localhost:8080/api-docs
```

## Características Implementadas

- CRUD completo (Create, Read, Update, Delete)
- Arquitectura Limpia (Clean Architecture)
- Inyección de Dependencias
- Validaciones de negocio robustas
- Cálculo automático de totales
- Endpoint especial para cancelar órdenes
- Filtrado por estado
- Documentación Swagger completa
- Manejo de errores con middleware
- Autenticación y autorización
- Ordenamiento por fecha de creación (más recientes primero)

## Principios de Arquitectura Limpia Aplicados

1. **Independencia de Frameworks:** La lógica de negocio no depende de Express o Mongoose
2. **Testeable:** La lógica de negocio puede ser testeada sin UI, DB, servidor web
3. **Independencia de UI:** La lógica de negocio no conoce el tipo de interfaz
4. **Independencia de Base de Datos:** Puedes cambiar MongoDB por otra DB sin cambiar la lógica
5. **Regla de Dependencia:** Las dependencias apuntan hacia adentro (dominio)

## Autor
Luis Fernando Suarez

## Fecha
Diciembre 2025
