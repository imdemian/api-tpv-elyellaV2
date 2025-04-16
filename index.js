const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const bcrypt = require("bcryptjs");

require("./src/database/database");

const notFound = require("./src/middlewares/notFound");
const errorHandler = require("./src/middlewares/handleErrors");
const verifyToken = require("./src/middlewares/verifyToken");

const app = express(); // Forma estándar

const PORT = process.env.PORT || 5055;

// Configuración de CORS y headers
app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, responseType, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// Montar Rutas
app.use("/auth/", require("./src/routes/login.routes"));
app.use("/usuarios/", require("./src/routes/usuario.routes"));

// Middlewares para rutas no encontradas y manejo de errores
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
