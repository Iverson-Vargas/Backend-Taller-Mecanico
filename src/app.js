// Cargar variables de entorno al inicio
import 'dotenv/config';

import { Servidor } from "./servidor/server.js";
const app = new Servidor();
app.listen();
