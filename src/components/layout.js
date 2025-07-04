// src/components/Layout.js
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div>
      <header className="p-4 bg-gray-800 text-white flex items-center">
        <img 
          src="public/assets/logo.png"  // <== use public URL path here
          alt="Logo" 
          className="h-10 w-auto"
        />
        <h1 className="ml-4 text-xl font-bold">Mustangly</h1>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;

