# Sistema de Gestión de Órdenes - Productos de Computadoras

## Descripción del Proyecto

API REST desarrollada con **Node.js**, **Express** y **MongoDB** siguiendo los principios de **Arquitectura Limpia (Clean Architecture)**. El sistema permite gestionar órdenes de productos de computadoras con un CRUD completo.

## Autor
**Luis Fernando Suarez**

## Características Principales

- **Arquitectura Limpia:** Separación clara entre capas (Domain, Application, Infrastructure, Presentation)
- **CRUD Completo:** Create, Read, Update, Delete para órdenes
- **Validaciones de Negocio:** Validación robusta de datos y reglas de negocio
- **Autenticación JWT:** Sistema de autenticación y autorización
- **Documentación Swagger:** API documentada e interactiva
- **Cálculo Automático:** El total se calcula automáticamente según cantidad, precio y descuento
- **Gestión de Estados:** Control de estados de órdenes (pendiente, procesando, enviado, entregado, cancelado)
- **Productos Predefinidos:** Catálogo de 20 productos de computadoras

## Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **Swagger** - Documentación de API
- **Morgan** - Logging HTTP

## Estructura del Proyecto (Clean Architecture)

```
back/
├── src/
│   ├── domain/                          # Capa de Dominio
│   │   ├── entities/                    # Entidades de negocio
│   │   │   ├── order.entity.js
│   │   │   ├── product.entity.js
│   │   │   ├── user.entity.js
│   │   │   └── role.entity.js
│   │   ├── repositories/                # Interfaces de repositorios
│   │   │   ├── order.repository.interface.js
│   │   │   ├── product.repository.interface.js
│   │   │   ├── user.repository.interface.js
│   │   │   └── role.repository.interface.js
│   │   └── errors/                      # Errores personalizados
│   │
│   ├── application/                     # Capa de Aplicación
│   │   └── use-cases/                   # Casos de uso (lógica de negocio)
│   │       ├── order.service.js
│   │       ├── product.service.js
│   │       ├── user.service.js
│   │       ├── role.service.js
│   │       └── auth.service.js
│   │
│   ├── infrastructure/                  # Capa de Infraestructura
│   │   └── repositories/
│   │       └── database/
│   │           └── mongo/
│   │               ├── config.js        # Configuración MongoDB
│   │               ├── models/          # Modelos Mongoose
│   │               │   ├── order.model.js
│   │               │   ├── product.model.js
│   │               │   ├── user.model.js
│   │               │   └── role.model.js
│   │               └── *.mongo.repository.js  # Implementaciones
│   │
│   └── presentation/                    # Capa de Presentación
│       ├── controller/                  # Controladores HTTP
│       │   ├── order.controller.js
│       │   ├── product.controller.js
│       │   ├── user.controller.js
│       │   ├── role.controller.js
│       │   └── auth.controller.js
│       ├── routes/                      # Definición de rutas
│       │   ├── order.routes.js
│       │   ├── product.routes.js
│       │   ├── user.routes.js
│       │   ├── role.routes.js
│       │   └── auth.routes.js
│       ├── middlewares/                 # Middlewares
│       │   ├── auth.middleware.js
│       │   ├── admin.middleware.js
│       │   └── error.handler.js
│       ├── utils/
│       │   └── async.handler.js
│       └── swagger.config.js            # Configuración Swagger
│
├── app.js                               # Punto de entrada
├── package.json
├── .env                                 # Variables de entorno
├── .gitignore
├── README.md                            # Este archivo
├── ORDER_API_DOCUMENTATION.md           # Documentación detallada de Orders API
└── order-test-data.json                 # Datos de prueba
```

## Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd back
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/orders-db
JWT_SECRET=tu_clave_secreta_super_segura
```

### 4. Iniciar MongoDB
Asegúrate de tener MongoDB ejecutándose localmente o usa MongoDB Atlas.

### 5. Ejecutar la aplicación
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:8080`

## Endpoints Principales

### Órdenes (Orders)
- `GET /api/v1/orders` - Obtener todas las órdenes
- `GET /api/v1/orders/:id` - Obtener orden por ID
- `GET /api/v1/orders/estado/:estado` - Obtener órdenes por estado
- `POST /api/v1/orders` - Crear nueva orden (requiere auth + admin)
- `PUT /api/v1/orders/:id` - Actualizar orden (requiere auth + admin)
- `PATCH /api/v1/orders/:id/cancel` - Cancelar orden (requiere auth + admin)
- `DELETE /api/v1/orders/:id` - Eliminar orden (requiere auth + admin)

### Productos (Products)
- `GET /api/v1/products` - Obtener todos los productos
- `GET /api/v1/products/:id` - Obtener producto por ID
- `POST /api/v1/products` - Crear producto (requiere auth + admin)
- `PUT /api/v1/products/:id` - Actualizar producto (requiere auth + admin)
- `DELETE /api/v1/products/:id` - Eliminar producto (requiere auth + admin)

### Autenticación (Auth)
- `POST /api/v1/auth/register` - Registrar usuario
- `POST /api/v1/auth/login` - Iniciar sesión

### Usuarios (Users)
- `GET /api/v1/users` - Obtener todos los usuarios (requiere auth + admin)
- `GET /api/v1/users/:id` - Obtener usuario por ID (requiere auth)
- `PUT /api/v1/users/:id` - Actualizar usuario (requiere auth)
- `DELETE /api/v1/users/:id` - Eliminar usuario (requiere auth + admin)

### Roles (Roles)
- `GET /api/v1/roles` - Obtener todos los roles (requiere auth + admin)
- `POST /api/v1/roles` - Crear rol (requiere auth + admin)

## Documentación Interactiva (Swagger)

Accede a la documentación completa e interactiva en:
```
http://localhost:8080/api-docs
```

## Documentación Detallada

Para ver la documentación completa de la API de órdenes, consulta:
- [ORDER_API_DOCUMENTATION.md](ORDER_API_DOCUMENTATION.md)

## Ejemplo de Creación de Orden

```bash
curl -X POST http://localhost:8080/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "producto": "Laptop Dell XPS",
    "descripcion": "Laptop Dell XPS 15 con procesador Intel i7, 16GB RAM, 512GB SSD",
    "cantidad": 2,
    "precio": 1500,
    "descuento": 10,
    "cliente": "Juan Pérez",
    "fechaEntrega": "2025-12-20"
  }'
```

## Productos Disponibles en el Sistema

1. Laptop HP Pavilion
2. Laptop Dell XPS
3. Laptop Lenovo ThinkPad
4. Laptop ASUS ROG
5. Monitor Samsung 27"
6. Monitor LG UltraWide
7. Teclado Mecánico Logitech
8. Mouse Gamer Razer
9. Tarjeta Gráfica NVIDIA RTX 4090
10. Tarjeta Gráfica AMD Radeon RX 7900
11. Procesador Intel Core i9
12. Procesador AMD Ryzen 9
13. RAM Corsair 32GB DDR5
14. SSD Samsung 1TB NVMe
15. Motherboard ASUS ROG
16. Fuente de Poder 850W
17. Case Gamer RGB
18. Webcam Logitech HD
19. Auriculares HyperX Cloud
20. Impresora HP LaserJet

## Estados de Órdenes

- `pendiente` - Orden recién creada
- `procesando` - Orden en proceso
- `enviado` - Orden enviada
- `entregado` - Orden entregada
- `cancelado` - Orden cancelada

## Validaciones Implementadas

- La cantidad debe ser mayor a 0
- El precio debe ser mayor a 0
- El descuento debe estar entre 0 y 100
- La fecha de entrega no puede ser en el pasado
- No se puede cancelar una orden ya entregada
- El total se calcula automáticamente: `(precio × cantidad) - descuento%`

## Principios de Clean Architecture

Este proyecto sigue los principios de Arquitectura Limpia:

1. **Independencia de Frameworks:** La lógica de negocio no depende de frameworks externos
2. **Testeable:** Fácil de testear sin dependencias externas
3. **Independencia de UI:** La lógica no depende de la interfaz
4. **Independencia de Base de Datos:** Se puede cambiar la DB sin afectar la lógica
5. **Regla de Dependencia:** Las dependencias apuntan hacia el centro (dominio)

### Flujo de Dependencias

```
Presentation Layer (Controllers/Routes)
        ↓
Application Layer (Services/Use Cases)
        ↓
Domain Layer (Entities/Interfaces)
        ↑
Infrastructure Layer (Repositories/DB)
```

## Scripts Disponibles

```bash
npm run dev        # Iniciar en modo desarrollo con nodemon
npm start          # Iniciar en modo producción
```

## Datos de Prueba

El archivo `order-test-data.json` contiene 20 órdenes de ejemplo que puedes usar para probar la API.

## Licencia

ISC

## Contacto

Para consultas o sugerencias, contacta a Luis Fernando Suarez.

---

**Desarrollado con Clean Architecture para mantener el código limpio, mantenible y escalable.**
