
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: number;
  email: string;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Token de autenticação não informado",
    });
  }

  const token = authorization.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!token || !secret) {
    return res.status(401).json({
      error: "Token ou configuração de autenticação inválida",
    });
  }

  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({
      error: "Token inválido ou expirado",
    });
  }
}
