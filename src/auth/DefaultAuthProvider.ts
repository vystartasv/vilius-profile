import { BaseAuthProvider, AuthError, InvalidCredentialsError, AuthProviderError } from '../utils/AuthError';
import type { AuthConfig } from '../config/auth';

// Mock users database for development/testing
const MOCK_USERS: Record<string, { password: string; identity: any }> = {
  'admin@example.com': {
    password: 'admin123',
    identity: {
      id: 'usr_admin_001',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      isVerified: true,
      timezone: 'Europe/London',
      locale: 'en',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
    },
  },
  'user@example.com': {
    password: 'user123',
    identity: {
      id: 'usr_user_001',
      name: 'Test User',
      email: 'user@example.com',
      role: 'user',
      isVerified: true,
      timezone: 'Europe/London',
      locale: 'en',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
    },
  },
};

export interface AuthResult {
  identity: {
    id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
    timezone?: string;
    locale?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  token?: string;
  expiresAt?: Date;
}

export class DefaultAuthProvider extends BaseAuthProvider {
  private config: AuthConfig;
  private tokens: Map<string, { identity: any; expiresAt: Date }> = new Map();

  constructor(config: AuthConfig, identityService?: any) {
    super(config, identityService);
    this.config = config;
  }

  authenticate(
    email: string,
    password: string,
    options?: { scope?: string; rememberMe?: boolean },
    timestamp?: number
  ): AuthResult | { error: string; code: number } {
    try {
      // Validate inputs
      if (!email || !password) {
        return { error: 'Email and password are required', code: 400 };
      }

      // Check mock users
      const user = MOCK_USERS[email.toLowerCase()];
      if (!user) {
        return { error: 'Invalid credentials', code: 401 };
      }

      // Verify password (in real implementation, use bcrypt/argon2)
      if (user.password !== password) {
        return { error: 'Invalid credentials', code: 401 };
      }

      // Generate token
      const token = this.generateToken();
      const expiresAt = new Date(Date.now() + this.config.sessionTimeoutMs);

      // Store token
      this.tokens.set(token, {
        identity: user.identity,
        expiresAt,
      });

      return {
        identity: user.identity,
        token,
        expiresAt,
      };
    } catch (err) {
      return { error: 'Authentication failed', code: 500 };
    }
  }

  validateToken(token: string): { valid: boolean; identity?: any; error?: string } {
    const tokenData = this.tokens.get(token);

    if (!tokenData) {
      return { valid: false, error: 'Invalid token' };
    }

    if (tokenData.expiresAt < new Date()) {
      this.tokens.delete(token);
      return { valid: false, error: 'Token expired' };
    }

    return { valid: true, identity: tokenData.identity };
  }

  refreshToken(token: string): { token?: string; expiresAt?: Date; error?: string } {
    const tokenData = this.tokens.get(token);

    if (!tokenData) {
      return { error: 'Invalid token' };
    }

    if (tokenData.expiresAt < new Date()) {
      this.tokens.delete(token);
      return { error: 'Token expired' };
    }

    // Generate new token
    const newToken = this.generateToken();
    const expiresAt = new Date(Date.now() + this.config.sessionTimeoutMs);

    // Replace old token
    this.tokens.delete(token);
    this.tokens.set(newToken, {
      identity: tokenData.identity,
      expiresAt,
    });

    return { token: newToken, expiresAt };
  }

  logout(token: string): { success: boolean } {
    const deleted = this.tokens.delete(token);
    return { success: deleted };
  }

  private generateToken(): string {
    // Simple token generation - in production use crypto secure random
    const array = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  // Development helper to add mock users
  addMockUser(email: string, password: string, identity: any): void {
    MOCK_USERS[email.toLowerCase()] = { password, identity };
  }

  // Development helper to clear all tokens
  clearTokens(): void {
    this.tokens.clear();
  }
}

export default DefaultAuthProvider;
