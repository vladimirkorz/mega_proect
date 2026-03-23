// backend/src/middleware/validation.ts
import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

// Валидация регистрации
export const validateRegister = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers and underscore"),
  
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Простой формат ошибок
      const errorMessages = errors.array().map(err => err.msg).join(", ");
      return res.status(400).json({ error: errorMessages });
    }
    next();
  }
];

// Валидация логина
export const validateLogin = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg).join(", ");
      return res.status(400).json({ error: errorMessages });
    }
    next();
  }
];