import { TOKEN_SECRET } from '../config.js';
import jwt from 'jsonwebtoken';

export function createAccessToken(payload) {
  // Se genera un token JWT después de guardar el usuario
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      'claveSegura', // Reemplaza 'claveSegura' con tu clave secreta real
      { expiresIn: '1d' }, // Puedes ajustar el tiempo de expiración según tus necesidades
      (err, token) => {
        if (err) reject(err);
        // Se devuelve el token como respuesta
        resolve(token);
      }
    );
  });
}
