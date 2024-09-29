'use client';

import { APP_ROUTES } from "@/constants/app-route";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export const checkIsPublicRoute = (asPath: string) => {
  const appPublicRoutes = Object.values(APP_ROUTES.public);
  return appPublicRoutes.includes(asPath);
};

export const checkUserAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    const userToken = localStorage.getItem('userToken');
    return !!userToken;
  }
  return false;
};

export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { push } = useRouter();
  const pathname = usePathname();
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsUserAuthenticated(checkUserAuthenticated());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!isUserAuthenticated && !checkIsPublicRoute(pathname)) {
        push(APP_ROUTES.public.login);
      }
    }
  }, [isUserAuthenticated, pathname, loading, push]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isUserAuthenticated && !checkIsPublicRoute(pathname) ? children : null}
    </>
  );
};
