// Presentation Layer - Presenters (MVP Pattern)

import { authService } from '@/domain/services/auth-service';
import { useAuthStore } from '@/presentation/stores';

export class AuthPresenter {
  async login(email: string, password: string) {
    try {
      const user = await authService.login(email, password);
      useAuthStore.getState().setUser(user);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  }

  async signup(email: string, password: string, name: string) {
    try {
      const user = await authService.signup(email, password, name);
      useAuthStore.getState().setUser(user);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    }
  }

  async logout() {
    try {
      await authService.logout();
      useAuthStore.getState().logout();
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Logout failed' };
    }
  }
}

export const authPresenter = new AuthPresenter();
