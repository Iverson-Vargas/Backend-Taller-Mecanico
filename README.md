# API Taller Mecánico — Backend

API RESTful para la gestión integral de un taller mecánico. Desarrollada con **Node.js**, **Express** y **Prisma ORM** sobre **PostgreSQL**. Sigue una arquitectura por capas (Rutas → Controladores → Servicios) con validaciones mediante `express-validator`.

**Autores:**
- Iverson Vargas
- Jose
- Daviana
- Anthony
- Isis
- Sebastian

---

## Estructura del Proyecto

```
src/
  app.js                          # Punto de entrada
  servidor/
    server.js                     # Clase Servidor (Express + rutas)
  config/
    prisma.config.js              # PrismaClient singleton
  rutas/                          # Definición de endpoints HTTP
    clientes.rutas.js
    vehiculos.rutas.js
    ordenes.rutas.js
    servicios.rutas.js
    inventario.rutas.js
    empleados.rutas.js
    nomina.rutas.js
    facturas.rutas.js
    gastos.rutas.js
    auth.rutas.js
    reportes.rutas.js
  controladores/                  # Lógica que maneja req/res
    clientes.controladores.js
    vehiculos.controladores.js
    ordenes.controladores.js
    servicios.controladores.js
    inventario.controladores.js
    empleados.controladores.js
    nomina.controladores.js
    facturas.controladores.js
    gastos.controladores.js
    auth.controladores.js
    reportes.controladores.js
  servicios/                      # Lógica de negocio + Prisma
    clientes.servicios.js
    vehiculos.servicios.js
    ordenes.servicios.js
    servicios.servicios.js
    inventario.servicios.js
    empleados.servicios.js
    nomina.servicios.js
    facturas.servicios.js
    gastos.servicios.js
    auth.servicios.js
    reportes.servicios.js
  validators/                     # Validaciones con express-validator
    clientes.validator.js
    vehiculos.validator.js
    ordenes.validator.js
    servicios.validator.js
    inventario.validator.js
    empleados.validator.js
    facturas.validator.js
    gastos.validator.js
    auth.validator.js
  middlewares/
    validate-fields.middleware.js  # Middleware de validación
prisma/
  schema.prisma                   # Modelos de la BD
```

---

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tu configuración de PostgreSQL

# 3. Generar el cliente de Prisma
npm run prisma:generate

# 4. Ejecutar migraciones
npm run prisma:migrate

# 5. Iniciar en modo desarrollo
npm run start:dev
```

La API estará disponible en `http://localhost:3000`

---

## Comandos

| Comando | Descripción |
|---|---|
| `npm run start:dev` | Desarrollo con recarga automática (nodemon) |
| `npm start` | Producción |
| `npm run prisma:generate` | Regenerar el cliente Prisma |
| `npm run prisma:migrate` | Aplicar migraciones a la BD |
| `npm run prisma:studio` | Visualizar datos en la BD |
| `npm run prisma:reset` | Resetear la BD (elimina datos) |

---

## Endpoints

Base URL: `http://localhost:3000/api`

### Clientes (`/api/clientes`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Lista todos los clientes |
| GET | `/:id` | Obtiene un cliente por ID |
| GET | `/consulta/:cedula` | Consulta estado del cliente por cédula |
| POST | `/` | Crea un nuevo cliente |
| POST | `/recepcion` | Registra cliente + vehículo (transacción) |
| PUT | `/:id` | Actualiza un cliente |
| DELETE | `/:id` | Elimina un cliente |

### Vehículos (`/api/carros`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Lista todos los vehículos |
| GET | `/:placa` | Obtiene un vehículo por placa |
| POST | `/` | Registra un nuevo vehículo |
| PUT | `/:placa` | Actualiza un vehículo |
| DELETE | `/:placa` | Elimina un vehículo |

### Órdenes de Servicio (`/api/ordenes`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Lista todas las órdenes |
| GET | `/finalizadas` | Lista órdenes finalizadas (para facturar) |
| GET | `/:id` | Detalle de una orden |
| POST | `/` | Crea una nueva orden |
| PUT | `/:id` | Actualiza una orden (estado, diagnóstico, etc.) |
| DELETE | `/:id` | Elimina una orden |

### Catálogo de Servicios (`/api/servicios`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Lista el catálogo de servicios |
| GET | `/:id` | Obtiene un servicio por ID |
| POST | `/` | Crea un nuevo servicio tabulado |
| PUT | `/:id` | Actualiza un servicio |
| DELETE | `/:id` | Elimina un servicio |

### Inventario (`/api/inventario`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Lista repuestos en inventario |
| GET | `/:id` | Obtiene un repuesto por ID |
| POST | `/` | Registra un nuevo repuesto |
| PUT | `/:id` | Actualiza un repuesto |
| DELETE | `/:id` | Elimina un repuesto |

### Empleados (`/api/empleados`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Lista todos los empleados |
| GET | `/:id` | Obtiene un empleado por cédula |
| POST | `/` | Registra un nuevo empleado |
| PUT | `/:id` | Actualiza un empleado |
| POST | `/calcular-comision` | Calcula y registra comisión de una orden |
| GET | `/mis-comisiones/:id` | Historial de comisiones de un empleado |

### Nómina (`/api/nomina`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/resumen` | Resumen de nómina por empleado |
| GET | `/historial` | Historial de pagos |

### Facturas (`/api/facturas`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Lista todas las facturas |
| GET | `/:id` | Detalle de una factura |
| POST | `/` | Genera una nueva factura (cambia estado de O.S. a "facturada") |

### Gastos (`/api/gastos`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Lista todos los gastos |
| GET | `/:id` | Obtiene un gasto por ID |
| POST | `/` | Registra un nuevo gasto |
| PUT | `/:id` | Actualiza un gasto |
| DELETE | `/:id` | Elimina un gasto |

### Autenticación (`/api/auth`)
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/login` | Autenticar usuario (correo o cédula + contraseña) |

### Reportes Contables (`/api/reportes`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/balance` | Balance General (Activos, Pasivos, Patrimonio) |
| GET | `/estado-resultados` | Estado de Resultados (Ingresos vs. Egresos) |
| GET | `/rentabilidad-servicios` | Rentabilidad por tipo de servicio |

---

## Variables de Entorno

| Variable | Descripción | Default |
|---|---|---|
| `API_PORT` | Puerto del servidor | `3000` |
| `DATABASE_URL` | URL de conexión a PostgreSQL | — |

---

## Requisitos

- Node.js >= 18
- npm
- PostgreSQL (local o remoto)
