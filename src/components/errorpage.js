import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Layout from './layout';

const ErrorPage = ({ errorCode = 404, errorMessage = "Page Not Found" }) => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-[calc(100vh-96px)] bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Your error image from public/assets */}
          <div className="flex items-center justify-center h-48 bg-gray-200">
            <img
              src="/assets/arpit.png"  // <== public URL path
              alt="Error illustration"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="p-6 text-center">
            <h1 className="text-5xl font-bold text-red-600 mb-2">{errorCode}</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{errorMessage}</h2>
            <p className="text-gray-600 mb-6">
              Oops! Something went wrong. The page you're looking for doesn't exist or an error occurred.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ErrorPage;
