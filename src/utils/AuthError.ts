export class AuthError extends Error {
  code: string;
  statusCode: number;
  details?: Record<string, any>;

  constructor(message: string, code: string = 'AUTH_ERROR', statusCode: number = 401, details?: Record<string, any>) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor(message: string = 'Invalid credentials') {
    super(message, 'INVALID_CREDENTIALS', 401);
    this.name = 'InvalidCredentialsError';
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }
}

export class InvalidTokenError extends AuthError {
  constructor(message: string = 'Invalid token') {
    super(message, 'INVALID_TOKEN', 401);
    this.name = 'InvalidTokenError';
    Object.setPrototypeOf(this, InvalidTokenError.prototype);
  }
}

export class SessionExpiredError extends AuthError {
  constructor(message: string = 'Session expired') {
    super(message, 'SESSION_EXPIRED', 401);
    this.name = 'SessionExpiredError';
    Object.setPrototypeOf(this, SessionExpiredError.prototype);
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 403);
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class AuthProviderError extends AuthError {
  constructor(message: string = 'Auth provider error') {
    super(message, 'AUTH_PROVIDER_ERROR', 500);
    this.name = 'AuthProviderError';
    Object.setPrototypeOf(this, AuthProviderError.prototype);
  }
}

export class BaseAuthProvider {
  config: any;
  identityService: any;

  constructor(config?: any, identityService?: any) {
    this.config = config;
    this.identityService = identityService;
  }

  authenticate(email: string, password: string, options?: any, timestamp?: number): { identity: any } | { error: string; code?: number } {
    // Default mock implementation - always fails
    return { error: 'No auth provider configured', code: 501 };
  }

  validateToken(token: string): { valid: boolean; identity?: any; error?: string } {
    return { valid: false, error: 'Token validation not implemented' };
  }

  refreshToken(token: string): { token?: string; error?: string } {
    return { error: 'Token refresh not implemented' };
  }

  logout(token: string): { success: boolean } {
    return { success: true };
  }
}
