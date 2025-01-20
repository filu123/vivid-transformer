import { useEffect, useState } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Github } from "lucide-react";

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
    <div className="min-h-screen flex w-full items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-lg">
            Sign in with GitHub to continue your journey
          </p>
        </div>
        
        {errorMessage && (
          <Alert variant="destructive" className="animate-shake">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg transform -rotate-1" />
          <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-xl border border-purple-100">
            <div className="flex items-center justify-center mb-6 space-x-2">
              <Github className="w-6 h-6" />
              <span className="text-lg font-semibold">GitHub Authentication</span>
            </div>
            
            <SupabaseAuth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#8B5CF6',
                      brandAccent: '#7C3AED',
                      brandButtonText: "white",
                      defaultButtonBackground: "white",
                      defaultButtonBackgroundHover: "#F9FAFB",
                      defaultButtonBorder: "lightgray",
                      defaultButtonText: "gray",
                      dividerBackground: "#E5E7EB",
                    },
                    space: {
                      buttonPadding: "16px",
                      inputPadding: "16px",
                    },
                    borderWidths: {
                      buttonBorderWidth: "1px",
                      inputBorderWidth: "1px",
                    },
                    radii: {
                      borderRadiusButton: "12px",
                      buttonBorderRadius: "12px",
                      inputBorderRadius: "12px",
                    },
                  },
                },
                style: {
                  button: {
                    fontSize: "16px",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                  },
                  anchor: {
                    color: "#8B5CF6",
                    fontSize: "14px",
                    textDecoration: "none",
                  },
                  message: {
                    fontSize: "14px",
                    color: "rgb(107 114 128)",
                  },
                },
              }}
              providers={["github"]}
              redirectTo={`${window.location.origin}/`}
              showLinks={false}
            />
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            By signing in, you agree to our{" "}
            <a href="#" className="text-purple-600 hover:text-purple-500 underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-purple-600 hover:text-purple-500 underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;