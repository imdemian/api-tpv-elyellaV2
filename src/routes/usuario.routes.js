const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario");

// Registrar un nuevo usuario
router.post("/", async (req, res) => {
  try {
    // 1. Obtener los datos del cuerpo de la solicitud
    const { usuario, nombre, password, rol, empleado } = req.body;

    // 2. Validar los datos de entrada
    if (!usuario || !nombre || !password) {
      return res.status(400).json({
        success: false,
        message: "El usuario, nombre y contraseña son necesarios",
      });
    }

    // 3. Verificar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({ usuario });
    if (usuarioExiste) {
      return res.status(400).json({
        success: false,
        message: "El usuario ya está registrado",
      });
    }

    // 4. Crear el nuevo usuario
    const nuevoUsuario = new Usuario({
      usuario,
      nombre,
      password,
      rol,
      empleado,
      estado: "activo",
    });

    // 5. Guardar el nuevo usuario y responder
    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      usuario: usuarioGuardado,
    });
  } catch (error) {
    // 6. Manejo de errores
    console.error("Error al registrar el usuario: ", error);

    res.status(500).json({
      success: false,
      message: "Error al registrar el usuario",
      error: error.message, // Solo en el desarrollo, no en producción
    });
  }
});

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    // 1. Obtener todos los usuarios (sin contraseña)
    const usuarios = await Usuario.find().select("-password");

    // 2. Responder con la lista de usuarios
    res.status(200).json(usuarios);
  } catch (error) {
    // 3. Manejo de errores
    console.error("Error al obtener los usuarios: ", error);

    res.status(500).json({
      success: false,
      message: "Error al obtener los usuarios",
      error: error.message, // Solo en el desarrollo, no en producción
    });
  }
});

// Obtener un usuario por su ID
router.get("/:id", async (req, res) => {
  try {
    // 1. Buscar el usuario por su ID
    const usuario = await Usuario.findById(req.params.id).select("-password");

    // 2. Verificar si el usuario existe
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // 3. Responder con el usuario
    res.status(200).json(usuario);
  } catch (error) {
    // 4. Manejo de errores
    console.error("Error al obtener el usuario: ", error);

    res.status(500).json({
      success: false,
      message: "Error al obtener el usuario",
      error: error.message, // Solo en el desarrollo, no en producción
    });
  }
});

// Actualizar un usuario por su ID
router.put("/:id", async (req, res) => {
  try {
    // 1. Obtener los datos del cuerpo de la solicitud
    const { usuario, nombre, rol, empleado } = req.body;

    // 2. Validar los datos de entrada
    if (!usuario || !nombre) {
      return res.status(400).json({
        success: false,
        message: "El usuario y nombre son necesarios",
      });
    }

    // 3. Buscar y actualizar el usuario
    const usuarioExiste = await Usuario.findById(req.params.id);
    if (!usuarioExiste) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // 4. Actualizar el usuario
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      { usuario, nombre, rol, empleado },
      { new: true }
    ).select("-password");

    // 5. Responder con el usuario actualizado
    res.status(200).json({
      success: true,
      message: "Usuario actualizado exitosamente",
      data: usuarioActualizado,
    });
  } catch (error) {
    // 6. Manejar errores
    console.error("Error al actualizar el usuario: ", error);

    res.status(500).json({
      success: false,
      message: "Error al actualizar el usuario",
      error: error.message, // Solo en desarrollo, no en producción
    });
  }
});

// Eliminar un usuario por su ID
router.delete("/:id", async (req, res) => {
  try {
    // 1. Buscar y eliminar el usuario
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);

    // 2. Verificar si el usuario existe
    if (!usuarioEliminado) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // 3. Responder con el usuario eliminado
    res.status(200).json({
      success: true,
      message: "Usuario eliminado exitosamente",
      data: usuarioEliminado,
    });
  } catch (error) {
    // 4. Manejo de errores
    console.error("Error al eliminar el usuario: ", error);

    res.status(500).json({
      success: false,
      message: "Error al eliminar el usuario",
      error: error.message, // Solo en desarrollo, no en producción
    });
  }
});

// Cambiar la contraseña de un usuario
router.put("/:id/password-change", async (req, res) => {
  try {
    // 1. Obtener los datos del cuerpo de la solicitud
    const { passwordActual, passwordNueva } = req.body;
    const { id } = req.params;

    // 2. Validar los datos de entrada
    if (!passwordActual || !passwordNueva) {
      return res.status(400).json({
        success: false,
        message: "La contraseña actual y la nueva son necesarias",
      });
    }

    // 3. Verificar que el usuario exista
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // 4. Verificar la contraseña actual
    const isMatch = await bcrypt.compare(passwordActual, usuario.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "La contraseña actual no coincide",
      });
    }

    // 5. Actualizar la contraseña
    usuario.password = passwordNueva;
    await usuario.save();

    // 6. Responder con el usuario actualizado
    res.status(200).json({
      success: true,
      message: "Contraseña actualizada exitosamente",
    });
  } catch (error) {
    // 7. Manejo de errores
    console.error("Error al actualizar la contraseña: ", error);

    res.status(500).json({
      success: false,
      message: "Error al actualizar la contraseña",
      error: error.message, // Solo en desarrollo, no en producción
    });
  }
});

module.exports = router;
