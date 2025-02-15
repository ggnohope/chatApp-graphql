import { useNavigate } from "react-router-dom";
import { authenticatedVar } from "../../constants/authenticated";
import { snackVar } from "../../constants/snack";

export const useGoogleAuth = () => {
  const navigate = useNavigate();

  const handleGoogleCallback = () => {
    try {
      // Get token from URL params
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get("token");

      if (!token) {
        throw new Error("No token found in URL");
      }

      // Store token
      localStorage.setItem("accessToken", token);

      // Update authentication state
      authenticatedVar(true);

      // Show success message
      snackVar({
        message: "Successfully logged in with Google",
        type: "success",
      });

      // Redirect to home
      navigate("/");
    } catch (error) {
      console.error("Google authentication error:", error);
      snackVar({
        message: "Failed to authenticate with Google",
        type: "error",
      });
      navigate("/login");
    }
  };

  return { handleGoogleCallback };
};
