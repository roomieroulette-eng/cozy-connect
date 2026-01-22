import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: ReactNode;
  requireOnboarding?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requireOnboarding = false 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [checkingOnboarding, setCheckingOnboarding] = useState(requireOnboarding);

  useEffect(() => {
    // Redirect to auth if not authenticated
    if (!loading && !user) {
      navigate('/auth', { replace: true });
      return;
    }

    // Check onboarding status if required
    if (requireOnboarding && user && !loading) {
      supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error checking onboarding status:', error);
            setCheckingOnboarding(false);
            return;
          }

          setOnboardingComplete(data?.onboarding_completed ?? false);
          setCheckingOnboarding(false);

          if (!data?.onboarding_completed) {
            navigate('/onboarding', { replace: true });
          }
        });
    } else if (!requireOnboarding) {
      setCheckingOnboarding(false);
    }
  }, [user, loading, navigate, requireOnboarding]);

  // Show loading state while checking auth
  if (loading || checkingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full" />
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!user) {
    return null;
  }

  // Don't render if onboarding required but not complete
  if (requireOnboarding && onboardingComplete === false) {
    return null;
  }

  return <>{children}</>;
}
