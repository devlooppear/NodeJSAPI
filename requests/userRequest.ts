import Validator from 'validatorjs';
import { Request } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRequestValidator {
  static async validateCreate(req: Request) {
    const rules = {
      name: 'required|string|min:3',
      email: 'required|email|min:3',
    };

    const validation = new Validator(req.body, rules);

    // Check uniqueness of email
    if (!validation.fails()) {
      const { email } = req.body;
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        validation.errors.add('email', 'Email already exists');
      }
    }

    return validation;
  }

  static validateUpdate(req: Request) {
    const rules = {
      name: 'string|min:3',
      email: 'email|min:3',
    };

    const validation = new Validator(req.body, rules);
    return validation;
  }
}
