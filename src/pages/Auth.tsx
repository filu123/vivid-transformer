import { useEffect, useState } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check if there's an existing session
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
      if (error) {
        setErrorMessage(getErrorMessage(error));
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          navigate("/");
        }
        if (event === "SIGNED_OUT") {
          setErrorMessage(""); // Clear errors on sign out
        }
        if (event === "USER_UPDATED") {
          const { error } = await supabase.auth.getSession();
          if (error) {
            setErrorMessage(getErrorMessage(error));
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.code) {
        case "invalid_credentials":
          return "Invalid email or password. Please check your credentials and try again.";
        case "email_not_confirmed":
          return "Please verify your email address before signing in.";
        case "user_not_found":
          return "No user found with these credentials.";
        case "session_not_found":
          return "Your session has expired. Please sign in again.";
        default:
          return error.message;
      }
    }
    return error.message;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in with GitHub to continue</p>
        </div>
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#1A1A1A',
                    brandAccent: '#4A4A4A',
                  },
                },
              },
            }}
            providers={["github"]}
            redirectTo={`${window.location.origin}/`}
            showLinks={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;