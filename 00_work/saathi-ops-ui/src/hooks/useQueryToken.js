import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { parseCookies, setCookie } from 'nookies';
import { COOKIES_MAX_AGE } from '../constants';

function useQueryToken({ setToken, setUserId }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const accessToken = urlParams.get('accessToken');
    const userId = urlParams.get('userId');

    if (accessToken) {
      // Save accessToken to cookies
      setToken(accessToken);
      setCookie(null, 'accessToken', accessToken, {
        maxAge: COOKIES_MAX_AGE, // 30 days
        path: '/',
      });

      // Remove accessToken from URL
      urlParams.delete('accessToken');
      navigate(
        {
          pathname: location.pathname,
          search: urlParams.toString(),
        },
        { replace: true },
      );
    }
    if (userId) {
      // Save userId to cookies
      setUserId(userId);
      setCookie(null, 'userId', userId, {
        maxAge: COOKIES_MAX_AGE, // 30 days
        path: '/',
      });

      // Remove userId from URL
      urlParams.delete('userId');
      navigate(
        {
          pathname: location.pathname,
          search: urlParams.toString(),
        },
        { replace: true },
      );
    }
  }, [location, navigate]);
}

export default useQueryToken;
