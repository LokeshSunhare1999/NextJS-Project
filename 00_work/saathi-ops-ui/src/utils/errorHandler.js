import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { ENDPOINTS } from '../apis/endpoints';
import { COOKIES_MAX_AGE } from '../constants';

export const errorHandler = async (error) => {
  const cookies = parseCookies();

  if (error?.response?.status === 401) {
    let shouldLogout = true;

    /** Refresh token */
    /* try {
      if (cookies?.refreshToken) {
        const tokenRefreshed = await refreshTokenHandler(cookies?.refreshToken);
        if (tokenRefreshed) {
          window.location.reload();
          shouldLogout = false;
        }
      }
    } catch (refreshError) {
    } */

    if (shouldLogout) {
      handleLogout();
    }
  }
};

export const refreshTokenHandler = async (refreshToken) => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}${ENDPOINTS?.getRefreshToken}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    },
  );

  if (!response.ok) {
    return null; // Indicate failure to refresh the token
  }

  const json = await response.json();
  const data = json?.data?.identity;

  // Set new cookies
  setCookie(null, 'accessToken', data?.accessToken, {
    maxAge: COOKIES_MAX_AGE,
    path: '/',
  });
  setCookie(null, 'refreshToken', data?.refreshToken, {
    maxAge: COOKIES_MAX_AGE,
    path: '/',
  });
  setCookie(null, 'userId', data?.loggedInUser?._id, {
    maxAge: COOKIES_MAX_AGE,
    path: '/',
  });

  return true; // Indicate successful token refresh
};

const handleLogout = () => {
  destroyCookie(null, 'accessToken');
  destroyCookie(null, 'userId');
  destroyCookie(null, 'refreshToken');
  destroyCookie(null, 'guestToken');
  sessionStorage?.removeItem('selectedLanguage');
  window.location.href = '/login';
};
