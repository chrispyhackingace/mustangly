import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Layout from './layout';
import arpitImg from '../assets/arpit.png'; // Adjust the path as necessary

const ErrorPage = ({ errorCode = 404, errorMessage = "Page Not Found" }) => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div style={{ minHeight: 'calc(100vh - 96px)', backgroundColor: '#f3f4f6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '640px', width: '100%', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'visible' }}>
          <div style={{ padding: '32px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '40px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>{errorCode}</h1>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>{errorMessage}</h2>
            <p style={{ color: '#6b7280', marginBottom: '48px' }}>
              Oops! Something went wrong. The page you're looking for doesn't exist or an error occurred.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '80px' }}>
              <img
                src={arpitImg}
                alt="Error illustration"
                style={{ width: '384px', height: '384px', objectFit: 'contain', margin: '0 auto', transform: 'scale(1.2)' }}
              />
            </div>
            <button
              onClick={() => navigate(-1)}
              style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 16px', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '8px', transition: 'background-color 0.2s', marginTop: '32px', gap: '8px' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            >
              <ArrowLeft style={{ width: '20px', height: '20px' }} />
              Return to society
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ErrorPage;
