import axios from 'axios';

export async function getAuthSession(req: any) {
  // console.log(ctx);
  const response = await axios.get('http://127.0.0.1:8000/api/account/me', {
    withCredentials: true,
    headers: {
      Cookie: req.headers.cookie || '',
    },
  });

  return response.data;
}
