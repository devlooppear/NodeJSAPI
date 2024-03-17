// requests/userRequest.ts
import Validator from 'validatorjs';
import { Request } from 'express';

export class UserRequestValidator {
  static validateCreate(req: Request) {
    const rules = {
      name: 'required|string|min:3',
      email: 'required|email|min:3',
    };

    const validation = new Validator(req.body, rules);
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
