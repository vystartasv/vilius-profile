import { describe, it, expect, beforeEach } from 'vitest';
import { AuthManager } from '../../src/auth/AuthManager';

describe('Auth Integration Flow', () => {
  let authManager: AuthManager;

  beforeEach(() => {
    // Clear global sessions before each test
    AuthManager.clearGlobalSessions();
    authManager = new AuthManager();
  });

  describe('Login Flow', () => {
    it('should authenticate with valid credentials', () => {
      const result = authManager.authenticate('admin@example.com', 'admin123');
      
      expect('identity' in result).toBe(true);
      if ('identity' in result) {
        expect(result.identity.email).toBe('admin@example.com');
        expect(result.identity.role).toBe('admin');
      }
    });

    it('should reject invalid credentials', () => {
      const result = authManager.authenticate('invalid@example.com', 'wrong');
      
      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.code).toBe(401);
      }
    });

    it('should create session on successful auth', () => {
      const authResult = authManager.authenticate('admin@example.com', 'admin123');
      
      expect('identity' in authResult).toBe(true);
      if ('identity' in authResult) {
        const session = authManager.createSession(authResult.identity.id, authResult.identity);
        
        expect(session.id).toBeDefined();
        expect(session.identityId).toBe(authResult.identity.id);
        expect(session.expiresAt).toBeInstanceOf(Date);
        expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now());
      }
    });
  });

  describe('Session Flow', () => {
    it('should validate active session', () => {
      const authResult = authManager.authenticate('user@example.com', 'user123');
      
      if ('identity' in authResult) {
        const session = authManager.createSession(authResult.identity.id, authResult.identity);
        
        // Create a mock request with session cookie (using vpp_ prefix from config)
        const request = new Request('http://localhost/admin', {
          headers: {
            Cookie: `vpp_${session.id}=${session.id}`,
          },
        });
        
        const auth = authManager.whoami(request);
        
        expect(auth.authenticated).toBe(true);
        expect(auth.identity).not.toBeNull();
      }
    });

    it('should reject expired session', () => {
      const authResult = authManager.authenticate('user@example.com', 'user123');
      
      if ('identity' in authResult) {
        const pastDate = new Date(Date.now() - 1000); // 1 second ago
        const session = authManager.createSession(authResult.identity.id, authResult.identity);
        
        // Manually expire the session
        Object.defineProperty(session, 'expiresAt', { value: pastDate });
        
        const request = new Request('http://localhost/admin', {
          headers: {
            Cookie: `vpp_${session.id}=${session.id}`,
          },
        });
        
        const auth = authManager.whoami(request);
        
        expect(auth.authenticated).toBe(false);
        expect(auth.identity).toBeNull();
      }
    });
  });

  describe('Protected Route Access', () => {
    it('should deny access when not authenticated', () => {
      const request = new Request('http://localhost/admin');
      const auth = authManager.whoami(request);
      
      expect(auth.authenticated).toBe(false);
    });

    it('should allow access when authenticated', () => {
      const authResult = authManager.authenticate('admin@example.com', 'admin123');
      
      if ('identity' in authResult) {
        const session = authManager.createSession(authResult.identity.id, authResult.identity);
        const request = new Request('http://localhost/admin', {
          headers: {
            Cookie: `vpp_${session.id}=${session.id}`,
          },
        });
        
        const auth = authManager.whoami(request);
        
        expect(auth.authenticated).toBe(true);
        expect(auth.identity?.role).toBe('admin');
      }
    });
  });

  describe('Authorization Header', () => {
    it('should authenticate via Bearer token', () => {
      const authResult = authManager.authenticate('admin@example.com', 'admin123');
      
      if ('identity' in authResult) {
        const session = authManager.createSession(authResult.identity.id, authResult.identity);
        const request = new Request('http://localhost/api/profile', {
          headers: {
            Authorization: `Bearer ${session.id}`,
          },
        });
        
        const auth = authManager.whoami(request);
        
        expect(auth.authenticated).toBe(true);
        expect(auth.identity?.email).toBe('admin@example.com');
      }
    });
  });
});
