import cookie from 'cookie';

interface authCookies {
  access_token?: string;
  refresh_token?: string;
}

export function parseCookies(req: any | null = null) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie || '');
}

export function saveTokensAsCookie(values: authCookies) {
  if (values.access_token) {
    const _cookie = cookie.serialize('access_token', values.access_token, {
      domain: process.env.NEXT_PUBLIC_DOMAIN,
      path: '/',
      expires: new Date(Date.now() + 60 * 1000 * 60 * 24),
      sameSite: 'lax',
      // 1s == 1000ms, 60s == 60000ms, 10m == 600000ms
    });
    document.cookie = _cookie;
  }
  if (values.refresh_token) {
    const _cookie = cookie.serialize('refresh_token', values.refresh_token, {
      domain: process.env.NEXT_PUBLIC_DOMAIN,
      path: '/',
      expires: new Date(Date.now() + 60 * 1000 * 60 * 24),
      sameSite: 'lax',
    });
    document.cookie = _cookie;
  }
}

export function clearAuthCookies() {
  const _cookie = cookie.serialize('access_token', '', {
    domain: process.env.NEXT_PUBLIC_DOMAIN,
    path: '/',
    expires: new Date(Date.now() - 1),
    sameSite: 'lax',
  });
  document.cookie = _cookie;
  const _cookie2 = cookie.serialize('refresh_token', '', {
    domain: process.env.NEXT_PUBLIC_DOMAIN,
    path: '/',
    expires: new Date(Date.now() - 1),
    sameSite: 'lax',
  });
  document.cookie = _cookie2;
}
