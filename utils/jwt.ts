import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET as string;

if (!SECRET) {
  throw new Error('JWT_SECRET no está definido en las variables de entorno');
}

export const generateToken = (payload: object) => {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET);
};