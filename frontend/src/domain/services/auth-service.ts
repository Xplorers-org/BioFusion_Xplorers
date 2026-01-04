// Implementation of Auth Service (Mock for now)

import { IAuthService } from './interfaces';
import { User } from '../models/types';

export class AuthService implements IAuthService {
  async login(email: string, password: string): Promise<User> {
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: '1',
      email,
      name: 'John Doe',
      createdAt: new Date(),
    };
  }

  async signup(email: string, password: string, name: string): Promise<User> {
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: '1',
      email,
      name,
      createdAt: new Date(),
    };
  }

  async logout(): Promise<void> {
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async getCurrentUser(): Promise<User | null> {
    // TODO: Implement actual API call
    return {
      id: '1',
      email: 'user@example.com',
      name: 'John Doe',
      createdAt: new Date(),
    };
  }
}

export const authService = new AuthService();
