import { useEffect, useState } from 'react';

export default function useGoogleSignIn() {
  const [userCreds, setUserCreds] = useState();

  const handleResponse = (res) => {
    setUserCreds(res);
    // setLoggedIn(true)
  };

  useEffect(() => {
    //Move this function into utils
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    document.head.appendChild(script);
    script.onload = () => {
      window?.google?.accounts?.id?.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleResponse,
      });
      window?.google?.accounts?.id?.renderButton(
        document.getElementById('signInDiv'),
        {
          text: 'continue_with',
          theme: 'outline',
          logo_alignment: 'center',
          size: 'large',
          width:
            window.innerWidth < 768
              ? `${Math.min(window.innerWidth - 45, 355)}px`
              : '392px',
        },
      );
    };
  }, []);

  return [userCreds];
}
