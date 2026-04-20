import { AuthManager } from '../auth/AuthManager';
import type { MiddlewareHandler } from 'astro';

const authManager = new AuthManager();

export const authMiddleware: MiddlewareHandler = async (context, next) => {
  const { request, locals } = context;
  
  // Attach auth context to locals for use in pages
  locals.auth = authManager.whoami(request);
  
  // Check if route requires auth
  const url = new URL(request.url);
  const protectedPaths = ['/admin', '/profile'];
  
  if (protectedPaths.some(path => url.pathname.startsWith(path))) {
    if (!locals.auth.authenticated) {
      return context.redirect('/login');
    }
  }
  
  return next();
};

export const onRequest = authMiddleware;
