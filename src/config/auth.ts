// Authentication configuration
export interface AuthConfig {
  sessionTimeoutMs: number;
  tokenPrefix: string;
  secureStorage: boolean;
  cookieSameSite: 'strict' | 'lax' | 'none';
  cookieSecure: boolean;
  cookieHttpOnly: boolean;
}

// Default configuration
export const defaultConfig: AuthConfig = {
  sessionTimeoutMs: 30 * 60 * 1000, // 30 minutes
  tokenPrefix: 'vpp_',
  secureStorage: true,
  cookieSameSite: 'lax',
  cookieSecure: true,
  cookieHttpOnly: true,
};

export function createConfig(options: Partial<AuthConfig> = {}): AuthConfig {
  return { ...defaultConfig, ...options };
}

export const config = createConfig();