import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js'

// Función para registrar un nuevo usuario
export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // Se encripta la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Se crea un nuevo usuario con los datos proporcionados
    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    // Se guarda el usuario en la base de datos
    const userSaved = await newUser.save();

    const token = await createAccessToken({ id: userSaved._id })
    res.cookie("token", token)

    // Se devuelve la información del usuario registrado
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    // En caso de error, se maneja aquí
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Función para el inicio de sesión 
export const login = (req, res) => {
  res.send('login');
};
