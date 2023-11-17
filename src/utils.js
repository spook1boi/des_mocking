import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createHash = async (password) => {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    console.error("Error al crear el hash de la contraseña: ", error);
    throw error;
  }
};

export const isValidPassword = (user, password) => {
  console.log("Comparando contraseñas:");
  console.log("Hash almacenado en la base de datos: " + user.password);
  console.log("Contraseña proporcionada: " + password);

  if (!user || !user.password || !password) {
    console.log("Faltan datos de usuario o contraseña.");
    return false;
  }

  return bcrypt.compareSync(password, user.password);
};

export const generateToken = (payload) => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret_key', {
      expiresIn: '1h',
    });
    return token;
  } catch (error) {
    console.error("Error al generar el token: ", error);
    throw error;
  }
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    return decoded;
  } catch (error) {
    console.error("Error al verificar el token: ", error);
    throw error;
  }
};

export default __dirname;