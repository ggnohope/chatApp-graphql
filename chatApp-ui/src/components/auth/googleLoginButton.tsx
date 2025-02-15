import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useState } from "react";

const GoogleLoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      window.location.href = `http://${
        import.meta.env.VITE_API_URL
      }/auth/google`;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      variant="outlined"
      startIcon={<GoogleIcon />}
      fullWidth
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : "Continue with Google"}
    </Button>
  );
};

export default GoogleLoginButton;
