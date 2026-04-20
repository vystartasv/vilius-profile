export type StorageType = 'localStorage' | 'sessionStorage' | 'memory';

export interface TokenData {
  token: string;
  expiresAt: string;
  identity?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export class TokenStorage {
  private storageType: StorageType;
  private prefix: string;
  private memoryStorage: Map<string, string> = new Map();

  constructor(
    storageType: StorageType = 'localStorage',
    prefix: string = 'vpp_auth_'
  ) {
    this.storageType = storageType;
    this.prefix = prefix;

    // Check if storage is available in this environment
    if (typeof window === 'undefined') {
      this.storageType = 'memory';
    }
  }

  private getStorage(): Storage | null {
    if (this.storageType === 'memory') return null;
    try {
      return this.storageType === 'localStorage'
        ? window.localStorage
        : window.sessionStorage;
    } catch {
      return null;
    }
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  set(key: string, value: TokenData): void {
    const fullKey = this.getKey(key);
    const serialized = JSON.stringify(value);

    if (this.storageType === 'memory') {
      this.memoryStorage.set(fullKey, serialized);
      return;
    }

    const storage = this.getStorage();
    if (storage) {
      try {
        storage.setItem(fullKey, serialized);
      } catch (e) {
        // Storage full or unavailable, fall back to memory
        this.memoryStorage.set(fullKey, serialized);
      }
    }
  }

  get(key: string): TokenData | null {
    const fullKey = this.getKey(key);

    if (this.storageType === 'memory') {
      const value = this.memoryStorage.get(fullKey);
      return value ? JSON.parse(value) : null;
    }

    const storage = this.getStorage();
    if (storage) {
      try {
        const value = storage.getItem(fullKey);
        return value ? JSON.parse(value) : null;
      } catch {
        return null;
      }
    }

    return null;
  }

  remove(key: string): void {
    const fullKey = this.getKey(key);

    if (this.storageType === 'memory') {
      this.memoryStorage.delete(fullKey);
      return;
    }

    const storage = this.getStorage();
    if (storage) {
      try {
        storage.removeItem(fullKey);
      } catch {
        // Ignore errors
      }
    }

    // Also clean up memory fallback
    this.memoryStorage.delete(fullKey);
  }

  clear(): void {
    if (this.storageType === 'memory') {
      this.memoryStorage.clear();
      return;
    }

    const storage = this.getStorage();
    if (storage) {
      try {
        // Only clear keys with our prefix
        const keysToRemove: string[] = [];
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (key?.startsWith(this.prefix)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => storage.removeItem(key));
      } catch {
        // Ignore errors
      }
    }

    // Also clear memory fallback
    this.memoryStorage.clear();
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  isExpired(key: string): boolean {
    const data = this.get(key);
    if (!data) return true;
    return new Date(data.expiresAt) < new Date();
  }

  getValidToken(key: string): string | null {
    const data = this.get(key);
    if (!data) return null;
    if (this.isExpired(key)) {
      this.remove(key);
      return null;
    }
    return data.token;
  }

  // Get all stored auth keys (for debugging/migration)
  keys(): string[] {
    const keys: string[] = [];

    if (this.storageType === 'memory') {
      for (const key of this.memoryStorage.keys()) {
        if (key.startsWith(this.prefix)) {
          keys.push(key.slice(this.prefix.length));
        }
      }
      return keys;
    }

    const storage = this.getStorage();
    if (storage) {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key?.startsWith(this.prefix)) {
          keys.push(key.slice(this.prefix.length));
        }
      }
    }

    return keys;
  }
}

// Singleton instance for app-wide use
let defaultStorage: TokenStorage | null = null;

export function getTokenStorage(
  storageType?: StorageType,
  prefix?: string
): TokenStorage {
  if (!defaultStorage || storageType || prefix) {
    defaultStorage = new TokenStorage(storageType, prefix);
  }
  return defaultStorage;
}

export function clearTokenStorage(): void {
  defaultStorage?.clear();
  defaultStorage = null;
}

export default TokenStorage;
