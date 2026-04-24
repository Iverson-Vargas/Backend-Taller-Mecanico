import express from 'express';
import cors from 'cors';

// Importar todas las rutas
import clientesRoutes from '../rutas/clientes.rutas.js';
import vehiculosRoutes from '../rutas/vehiculos.rutas.js';
import ordenesRoutes from '../rutas/ordenes.rutas.js';
import serviciosRoutes from '../rutas/servicios.rutas.js';
import inventarioRoutes from '../rutas/inventario.rutas.js';
import empleadosRoutes from '../rutas/empleados.rutas.js';
import nominaRoutes from '../rutas/nomina.rutas.js';
import facturasRoutes from '../rutas/facturas.rutas.js';
import gastosRoutes from '../rutas/gastos.rutas.js';
import authRoutes from '../rutas/auth.rutas.js';
import reportesRoutes from '../rutas/reportes.rutas.js';
import contabilidadRoutes from '../rutas/contabilidad.rutas.js';

export class Servidor {
  app;
  port;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.pre = '/api';

    this.middlewares();

    // Definición centralizada de todas las rutas
    this.rutas = {
      clientes:   `${this.pre}/clientes`,
      vehiculos:  `${this.pre}/carros`,       // Mantiene /api/carros para compatibilidad con el frontend
      ordenes:    `${this.pre}/ordenes`,
      servicios:  `${this.pre}/servicios`,
      inventario: `${this.pre}/inventario`,
      empleados:  `${this.pre}/empleados`,
      nomina:     `${this.pre}/nomina`,
      facturas:   `${this.pre}/facturas`,
      gastos:     `${this.pre}/gastos`,
      auth:       `${this.pre}/auth`,
      reportes:   `${this.pre}/reportes`,
      contabilidad: `${this.pre}/contabilidad`,
    };

    this.routes();
  }

  middlewares = () => {
    this.app.use(cors());
    this.app.use(express.json());
  };

  routes = () => {
    this.app.use(this.rutas.clientes, clientesRoutes);
    this.app.use(this.rutas.vehiculos, vehiculosRoutes);
    this.app.use(this.rutas.ordenes, ordenesRoutes);
    this.app.use(this.rutas.servicios, serviciosRoutes);
    this.app.use(this.rutas.inventario, inventarioRoutes);
    this.app.use(this.rutas.empleados, empleadosRoutes);
    this.app.use(this.rutas.nomina, nominaRoutes);
    this.app.use(this.rutas.facturas, facturasRoutes);
    this.app.use(this.rutas.gastos, gastosRoutes);
    this.app.use(this.rutas.auth, authRoutes);
    this.app.use(this.rutas.reportes, reportesRoutes);
    this.app.use(this.rutas.contabilidad, contabilidadRoutes);
    
    // Alias para compatibilidad con el frontend antiguo
    this.app.use(`${this.pre}/egresos`, contabilidadRoutes);

    // Ruta raíz de la API
    this.app.get(this.pre, (req, res) => {
      res.json({
        mensaje: '¡Bienvenido a la API del Taller Mecánico!',
        version: '1.0.0',
        endpoints: this.rutas
      });
    });
  };

  listen = () => {
    this.app.listen(this.port, () => {
      console.log(`==============================================`);
      console.log(`  🔧 Taller Mecánico API`);
      console.log(`  🚀 Servidor corriendo en http://localhost:${this.port}`);
      console.log(`  📡 API disponible en http://localhost:${this.port}${this.pre}`);
      console.log(`==============================================`);
    });
  };
}
