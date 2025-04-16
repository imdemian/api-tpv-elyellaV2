const jwt = require("jsonwebtoken");
const { jwtDecode } = require("jwt-decode");
const { token } = require("morgan");

/**
 * Verifica si un token JWT ha expirado.
 * @param {string} token - El token JWT a verificar.
 * @returns {boolean} - Retorna `true` si el token ha expirado, de lo contrario `false`.
 */
const isExpired = (token) => {
  // Decodifica el token para obtener la fecha de expiración (exp)
  const { exp } = jwtDecode(token);
  // Compara la fecha actual con la fecha de expiración del token
  return Date.now() >= exp * 1000; // Multiplicamos por 1000 para convertir segundos a milisegundos
};

/**
 * Middleware para verificar la validez de un token JWT en las solicitudes.
 * Si el token es válido, permite que la solicitud continúe.
 * Si el token es inválido, expirado o no está presente, devuelve un error 401.
 * @param {object} req - El objeto de solicitud HTTP.
 * @param {object} res - El objeto de respuesta HTTP.
 * @param {function} next - La función para pasar el control al siguiente middleware.
 */
const verifyToken = (req, res, next) => {
  // Extrae el encabezado de autorización de la solicitud
  const { authorization } = req.headers;

  try {
    // Verifica si el encabezado de autorización está presente
    if (!authorization) {
      return res.status(401).json({ message: "No autorizado" });
    }

    // Extrae el token del encabezado de autorización (el formato es "Bearer <token>")
    const token = authorization.split(" ")[1];
    // Verifica si el token es "null" o no está presente
    if (token === "null") {
      return res.status(401).json({ message: "No autorizado" });
    }

    // Verifica la validez del token usando la clave secreta
    const payload = jwt.verify(token, "secretkey");
    // Verifica si el token ha expirado
    if (isExpired(token)) {
      return res.status(401).json({ message: "Token expirado" });
    }

    // Verifica si el payload del token es válido
    if (!payload) {
      return res.status(401).json({ message: "No autorizado" });
    }

    // Si el token es válido, adjunta el ID del usuario al objeto de solicitud (req)
    req._id = payload._id;
    // Pasa el control al siguiente middleware
    next();
  } catch (error) {
    // Captura cualquier error y devuelve un mensaje de error 401
    console.error(error);
    res.status(401).json({ message: "No autorizado" });
  }
};

// Exporta las funciones para su uso en otros módulos
module.exports = { verifyToken, isExpired };
