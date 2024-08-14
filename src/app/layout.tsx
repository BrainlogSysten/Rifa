'use client';

import NextAuthSessionProvider from '@/providers/sessionProvider';
import './globals.css';
import type { Metadata } from 'next';
import { usePathname } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import { checkIsPublicRoute, PrivateRoute } from '@/utils/utils';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const [isPublicPage, setIsPublicPage] = useState(false);

  useEffect(() => {
    setIsPublicPage(checkIsPublicRoute(pathName));
  }, [pathName]);

  return (
    <html lang="pt-br">
      <head>

      </head>
      <body>
      <ToastContainer />
        
        {isPublicPage ? children : <PrivateRoute>{children}</PrivateRoute>}
      </body>
    </html>
  );
}
