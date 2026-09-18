import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { UserRole } from '../models/User';

export interface TokenPayload {
  id: string;
  role: UserRole;
}

export const generateToken = (id: string, role: UserRole): string => {
  return jwt.sign({ id, role }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN as any,
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, ENV.JWT_SECRET) as TokenPayload;
};
