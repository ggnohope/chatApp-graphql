import { useEffect } from "react";
import { useGoogleAuth } from "../../hooks/auth/useGoogleAuth";

const GoogleCallback = () => {
  const { handleGoogleCallback } = useGoogleAuth();

  useEffect(() => {
    handleGoogleCallback();
  }, [handleGoogleCallback]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p>Processing Google login...</p>
    </div>
  );
};

export default GoogleCallback;
