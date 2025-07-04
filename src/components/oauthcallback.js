import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code && window.opener) {
      window.opener.postMessage({ type: 'google-auth-code', code }, window.location.origin);
      window.close();
    } else {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <p className="text-gray-700 text-lg text-center">
        Processing login, please wait... <br />
        If you see this message for long, please close this tab and try again.
      </p>
    </div>
  );
};

export default OAuthCallback;
