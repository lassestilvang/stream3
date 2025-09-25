// hooks/use-auth.ts
import { useState, useEffect } from 'react';
import { auth } from '@/lib/auth';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await auth();
        setUser(session?.user || null);
      } catch (err) {
        console.error('Auth error:', err);
        setError('Failed to check authentication');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, loading, error };
};