const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

// Modelo de la colección usuarios
const usuarioSchema = new Schema(
  {
    usuario: {
      type: String,
      required: [true, "El usuario es obligatorio"],
      unique: true,
      trim: true,
    },
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minLength: [8, "La contraseña debe tener al menos 8 caracteres"],
    },
    rol: {
      type: String,
      default: "USER",
      enum: ["ADMIN", "MANAGER", "TECNICO"],
    },
    empleado: {
      type: Schema.Types.ObjectId,
      ref: "Empleado",
      default: null,
    },
    estado: {
      type: String,
      default: "activo",
    },
  },
  { timestamps: true }
);

// Encriptar contraseña antes de guardar el documento
usuarioSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Método para comprar la contraseña ingresada con la almacenada en la base de datos
usuarioSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Crear índice compuesto para optimizar las consultas de usuario y rol
usuarioSchema.index({ usuario: 1, rol: 1 });

module.exports = mongoose.model("Usuario", usuarioSchema);
