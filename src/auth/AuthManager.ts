import { createConfig, type AuthConfig } from '../config/auth';
// import { createId } from '@paralleloco/createId/genId';
import type { Router } from '../utils/router';
import { BaseAuthProvider, AuthError, InvalidTokenError, SessionExpiredError } from '../utils/AuthError';
import { DefaultAuthProvider } from './DefaultAuthProvider';

export interface AuthSession {
  id: string;
  identityId: string;
  identity: any;
  createdAt: Date;
  expiresAt: Date;
  lastActiveAt: Date;
  data?: Record<string, any>;
  routes?: string[];
}

export interface AuthContext {
  identity: any;
  session: AuthSession;
  token: string | null;
}

function createId(length = 21): string {
  return 'xxxxxxxxxxxx-' +
         'xxxxxxxxx'.split('').map(() => Math.random().toString(36).slice(2, 8)).join('');
}

// Global session store for SSR/API routes (persists across AuthManager instances)
const globalSessions = new Map<string, AuthSession>();

export class AuthManager {
  private config: AuthConfig;
  private provider: BaseAuthProvider;
  private identityService: { validate: any; fromUser: any; fromSession: any; fromToken: any; merge: any };
  private readonly router: Router;
  private sessions: Map<string, AuthSession>;
  private authMiddleware: any;
  private pendingAuth: Set<string> = new Set();

  // Static accessor for global sessions (useful for testing)
  static getGlobalSessions(): Map<string, AuthSession> {
    return globalSessions;
  }

  // Clear all sessions (useful for testing)
  static clearGlobalSessions(): void {
    globalSessions.clear();
  }

  constructor(config?: AuthConfig, identityService?: any, provider?: BaseAuthProvider, options?: { useGlobalSessions?: boolean }) {
    this.config = createConfig(config);
    this.provider = provider || new DefaultAuthProvider(this.config, identityService);
    this.identityService = identityService || {
      validate: (data: any) => this.identityService.validate?.(data) || data,
      fromUser: (name: string, email: string, role?: string) => this.identityService.fromUser?.(name, email, role) || { id: '', name, email, role: role || 'user' as const, createdAt: new Date(), updatedAt: new Date() },
      fromSession: (_session: any) => null,
      fromToken: (_token: string, _session: any) => null,
      merge: (existing: any, updates: any) => ({ ...existing, ...updates, updatedAt: new Date() }),
    };
    // Use global sessions by default for SSR persistence
    this.sessions = options?.useGlobalSessions !== false ? globalSessions : new Map();
  }

  setRouter(router: Router): this {
    this.router = router;
    return this;
  }

  setAuthProvider(provider: BaseAuthProvider): this {
    this.provider = provider;
    return this;
  }

  init() {
    return {
      auth: {
        check: this.check,
        require: this.require,
        isAuthenticated: this.isAuthenticated,
        whoami: this.whoami,
      }
    };
  }

  authenticate(email: string, password: string, options?: { scope?: string }) {
    const timestamp = Date.now();
    
    // This will be overridden by the actual auth provider
    return this.provider.authenticate(email, password, options, timestamp);
  }

  check(request: Request, params?: { requiredRoles?: string[] }): any {
    if (request.url.pathname.includes('/_auth/token')) {
      return this.handleTokenRequest(request, params);
    }
    if (request.url.pathname.includes('/_auth/me')) {
      return this.handleMeRequest(request, params);
    }
    if (this.isAuthenticated(request)) {
      return this.handleAuthenticated(request, params);
    }
    
    // Redirect to login
    return this.redirectToLogin(request);
  }

  require(request: Request, params?: { roles?: string[] }): any {
    if (!this.isAuthenticated(request)) {
      return this.redirectToLogin(request);
    }
    
    return this.handleAuthenticated(request, params);
  }

  isAuthenticated(request: Request): boolean {
    const session = this.extractSession(request);
    return session !== null && this.isValidSession(session, request);
  }

  whoami(request: Request): any {
    const session = this.extractSession(request);
    if (!session || !this.isValidSession(session, request)) {
      return { authenticated: false, identity: null };
    }
    
    return {
      authenticated: true,
      identity: this.identityService.merge(session.identity, { updatedAt: new Date() }),
    };
  }

  createSession(userId: string, identity: any, options?: { durationMs?: number }) {
    const id = createId();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + this.config.sessionTimeoutMs);
    
    const session: AuthSession = {
      id,
      identityId: userId,
      identity,
      createdAt,
      expiresAt,
      lastActiveAt: createdAt,
    };
    
    this.sessions.set(id, session);
    return session;
  }

  private extractSession(request: Request): AuthSession | null {
    // Check header for API requests
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (token) {
      return this.sessions.get(token);
    }
    
    // Check cookie for web requests
    const cookie = request.headers.get('Cookie')?.split('; ').find(c => c.startsWith(`${this.config.tokenPrefix}`));
    if (cookie) {
      const [, token] = cookie.split('=');
      return this.sessions.get(token);
    }
    
    return null;
  }

  private isValidSession(session: AuthSession, request?: Request): boolean {
    // Check expiration
    if (session.expiresAt < new Date()) {
      this.sessions.delete(session.id);
      return false;
    }
    
    // Check routes if restricted
    if (session.routes && session.routes.length > 0) {
      if (!request || !session.routes.includes(request.url.pathname)) {
        return false;
      }
    }
    
    return true;
  }

  private async handleTokenRequest(request: Request, params?: { requiredRoles?: string[] }): Promise<Response> {
    if (request.method === 'POST') {
      // Create new session
      const body = await request.json();
      const { email, password } = body;
      
      if (!email || !password) {
        return new Response(JSON.stringify({ error: 'Email and password required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      const result = this.provider.authenticate(email, password, params);
      
      if (result.error) {
        return new Response(JSON.stringify(result), {
          status: result.code || 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      const { identity } = result;
      const session = this.createSession(identity.id, identity, { durationMs: this.config.sessionTimeoutMs });
      
      const { name, email: userEmail, role, avatar } = identity;
      
      // Get client IP for analytics
      const clientIp = request.headers.get('X-Forwarded-For') || request.headers.get('X-Real-IP') || request.headers.get('CF-Connecting-IP') || 'unknown';
      
      return new Response(JSON.stringify({
        session: {
          id: session.id,
          token: session.id,
          expiresAt: session.expiresAt.toISOString(),
          identity: {
            id: identity.id,
            name,
            email: userEmail,
            role,
            avatar,
            timezone: identity.timezone || 'Europe/London',
            locale: identity.locale || 'en',
          },
        },
        config: this.config,
        clientIp,
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `${this.config.tokenPrefix}${session.id}=Secure;HttpOnly;SameSite=${this.config.cookieSameSite};Path=/;Max-Age=${this.config.sessionTimeoutMs / 1000};${this.config.cookieSecure ? 'Secure' : ''}`,
        },
      });
    }
    
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private async handleMeRequest(request: Request, params?: { requiredRoles?: string[] }): Promise<Response> {
    const session = this.extractSession(request);
    
    if (!session) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    if (!session || !this.isValidSession(session, request)) {
      return new Response(JSON.stringify({ error: 'Session expired' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({
      identity: this.identityService.merge(session.identity, { updatedAt: new Date() }),
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private handleAuthenticated(request: Request, params?: { requiredRoles?: string[] }): any {
    // Role checking would happen here
    return new Response(null, {
      status: 204,
    });
  }

  private redirectToLogin(request: Request): any {
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/login',
      },
    });
  }

  private storeToken(session: AuthSession): string {
    const token = this.config.tokenPrefix + session.id;
    return token;
  }

  logout(): any {
    return new Response(null, {
      status: 204,
    });
  }
}

export default AuthManager;