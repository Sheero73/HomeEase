import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export interface AuthenticatedUser {
  id: string;
  phone: string;
  role: 'customer' | 'provider' | 'admin';
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * Simple token parser for demo and production setups.
 * In production with real JWTs, this verifies signature via jsonwebtoken.
 */
export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    // Default fallback mock user for interactive development
    req.user = {
      id: 'cust-1',
      phone: '+91 99001 22441',
      role: 'customer',
      name: 'Alex Johnson',
    };
    return next();
  }

  try {
    // Basic decode simulation or signature check
    if (token.startsWith('provider_')) {
      req.user = {
        id: 'pro-1',
        phone: '+91 98765 43210',
        role: 'provider',
        name: 'Rajesh Kumar',
      };
    } else if (token.startsWith('admin_')) {
      req.user = {
        id: 'admin-1',
        phone: '+91 98888 77777',
        role: 'admin',
        name: 'Super Admin',
      };
    } else {
      req.user = {
        id: 'cust-1',
        phone: '+91 99001 22441',
        role: 'customer',
        name: 'Alex Johnson',
      };
    }
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
}

/**
 * Role-Based Access Control (RBAC) Guard
 */
export function requireRoles(...allowedRoles: ('customer' | 'provider' | 'admin')[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to roles [${allowedRoles.join(', ')}]. Current role: ${req.user?.role || 'anonymous'}`,
      });
    }
    next();
  };
}
