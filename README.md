# ⚙️ Backend - Taller Mecánico

API REST robusta y escalable desarrollada para respaldar la gestión integral de un taller mecánico. Este sistema funciona como el núcleo de datos y lógica de negocio para administrar clientes, vehículos, inventario de repuestos, mecánicos y facturación.

## 🛠️ Tecnologías Utilizadas

* **Entorno de ejecución:** Node.js
* **Framework web:** Express.js
* **ORM:** Prisma (v6)
* **Base de Datos:** PostgreSQL
* **Control de versiones:** Git / GitHub

## 📋 Requisitos Previos

Antes de instalar y correr el proyecto, asegúrate de tener instalado en tu sistema Windows:
* [Node.js](https://nodejs.org/) (versión 18 o superior).
* [PostgreSQL](https://www.postgresql.org/) y pgAdmin para la gestión de la base de datos local.

## 🚀 Instalación y Configuración Local

Sigue estos pasos para levantar el servidor en tu entorno local de desarrollo:

### 1. Clonar el repositorio

bash
git clone [https://github.com/Iverson-Vargas/Backend-Taller-Mecanico.git](https://github.com/Iverson-Vargas/Backend-Taller-Mecanico.git)

cd Backend-Taller-Mecanico

2. Instalar las dependencias
Instala todos los paquetes necesarios para Node, Express y Prisma ejecutando:

Bash
npm install

3. Configurar las Variables de Entorno
Crea un archivo llamado .env en la raíz del proyecto y configura la conexión a tu base de datos local y el puerto del servidor. Puedes usar este formato:

Fragmento de código
# Configuración del servidor
PORT=3000

# Conexión a la base de datos PostgreSQL (Ajusta TU_CONTRASEÑA)
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/taller_mecanico?schema=public"
4. Generar el Cliente de Prisma y Sincronizar
Para que Prisma reconozca la estructura de la base de datos y genere los tipos de datos correctos, ejecuta:

Bash
npx prisma generate

** Si es la primera vez que levantas la base de datos o necesitas crear las tablas desde cero, ejecuta la migración:

Bash
npx prisma migrate dev --name init

5. Iniciar el Servidor
Para iniciar el servidor en modo desarrollo (con recarga automática mediante nodemon), utiliza:

Bash
npm run dev

La consola debería mostrar el mensaje: Servidor corriendo en http://localhost:3000

📂 Estructura Principal de la Base de Datos
El sistema está diseñado con las siguientes entidades principales:

Empleados: Gestión de mecánicos y personal administrativo (usando Cédula/RIF como identificador).

Clientes y Carros: Relación de dueños y sus vehículos (identificados por placa).

Órdenes de Servicio: Registro de diagnósticos y asignación de mecánicos a vehículos.

Inventario y Compras: Control de stock de repuestos y gestión de proveedores.

Facturación: Emisión de facturas vinculadas a las órdenes de servicio.

¡Con este archivo tu repositorio se verá impecable! 

Ahora que ya tienes la base de datos montada, el README listo y el servidor configurado, ¿te
