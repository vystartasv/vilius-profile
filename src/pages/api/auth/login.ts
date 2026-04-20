import type { APIRoute } from 'astro';
import { AuthManager } from '../../../auth/AuthManager';

export const POST: APIRoute = async ({ request, cookies }) => {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirect = (formData.get('redirect') as string) || '/';

  if (!email || !password) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/login?error=invalid&redirect=${encodeURIComponent(redirect)}`,
      },
    });
  }

  const authManager = new AuthManager();
  const result = authManager.authenticate(email, password);

  if ('error' in result) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/login?error=invalid&redirect=${encodeURIComponent(redirect)}`,
      },
    });
  }

  const session = authManager.createSession(result.identity.id, result.identity);
  
  // Set session cookie
  cookies.set('session', session.id, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: redirect,
    },
  });
};
