import { useEffect } from 'react';
import axios from 'axios';

function GoogleAuthHandler() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      axios.post('http://localhost:5000/api/oauth/google', { code })
        .then(res => {
          const { token, user } = res.data;

          // Send token to the parent window (the one that opened the popup)
          console.log(window.opener)
          if (window.opener) {
            console.log('[popup] Posting code to main window');
            window.opener.postMessage(
                { type: 'google-auth-code', code },
                window.location.origin
            );
            window.close();
          }
        })
        .catch(err => {
          console.error('Google auth failed:', err);
          //window.close(); // Still close the popup even on error
        });
    }
  }, []);

  return <p>Logging in with Google...</p>;
}

export default GoogleAuthHandler;