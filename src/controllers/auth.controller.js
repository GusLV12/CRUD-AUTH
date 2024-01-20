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
    const userFound = await newUser.save();

    const token = await createAccessToken({ id: userFound._id })
    res.cookie("token", token)

    // Se devuelve la información del usuario registrado
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    // En caso de error, se maneja aquí
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Función para el inicio de sesión 
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {

    const userFound = await User.findOne({ email })

    if (!userFound) return res.status(400).json({ message: "user not found" })

    // Se encripta la contraseña
    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) return res.status(404).json({ message: "Incorrect credential" })
    // Se crea un nuevo usuario con los datos proporcionados

    const token = await createAccessToken({ id: userFound._id })
    res.cookie("token", token)

    // Se devuelve la información del usuario registrado
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    // En caso de error, se maneja aquí
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const logout = (req, res) => {
  res.cookie('token', "", {
    expires: new Date(0)
  })

  return res.sendStatus(200);
}

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);

  if (!userFound) return res.status(404).json({ message: "User not found" })
  
  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  })
}