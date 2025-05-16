import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'Meet Vaghani';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

export const generateToken = (payload: Record<string, any>, expiresIn: string = JWT_EXPIRES_IN): string => {
  // Use type assertion to help TypeScript understand the correct types
  return jwt.sign(
    payload, 
    JWT_SECRET as jwt.Secret, 
    { expiresIn } as jwt.SignOptions
  );
};

export const verifyToken = (token: string): any | null => {
  try {
    return jwt.verify(token, JWT_SECRET as jwt.Secret);
  } catch (error) {
    return null;
  }
};

export const decodeToken = (token: string): any | null => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};