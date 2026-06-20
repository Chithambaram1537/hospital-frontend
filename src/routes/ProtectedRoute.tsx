import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export default function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { token, isLoading } = useAuth();

  if (isLoading) return null;

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}