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
      path: '/',
      expires: new Date(Date.now() + 60 * 1000 * 60 * 24),
      sameSite: 'lax',
      // 1s == 1000ms, 60s == 60000ms, 10m == 600000ms
    });
    document.cookie = _cookie;
  }
  if (values.refresh_token) {
    const _cookie = cookie.serialize('refresh_token', values.refresh_token, {
      path: '/',
      expires: new Date(Date.now() + 60 * 1000 * 60 * 24),
      sameSite: 'lax',
    });
    document.cookie = _cookie;
  }
}

export function clearAuthCookies() {
  const _cookie = cookie.serialize('access_token', '', {
    path: '/',
    expires: new Date(Date.now() - 1),
    sameSite: 'lax',
  });
  document.cookie = _cookie;
  const _cookie2 = cookie.serialize('refresh_token', '', {
    path: '/',
    expires: new Date(Date.now() - 1),
    sameSite: 'lax',
  });
  document.cookie = _cookie2;
}

export function getCookie(name) {
  let cookieValue = null;
  if (typeof window != 'undefined') {
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + '=') {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
  }
  return cookieValue;
}
