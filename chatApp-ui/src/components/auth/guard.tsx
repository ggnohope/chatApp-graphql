import { useEffect } from "react";
import { excludedRoutes } from "../../constants/excludedRoutes";
import { useGetMe } from "../../hooks/user/useGetMe";
import { authenticatedVar } from "../../constants/authenticated";
import { snackVar } from "../../constants/snack";

const Guard = ({ children }: { children: JSX.Element }) => {
  const { data: user, error } = useGetMe();

  useEffect(() => {
    if (user) {
      authenticatedVar(true);
    }
  }, [user]);

  useEffect(() => {
    if (error?.networkError) {
      snackVar({ message: error.message, type: "error" });
    }
  }, [error]);

  return (
    <>
      {excludedRoutes.includes(window.location.pathname)
        ? children
        : user && children}
    </>
  );
};

export default Guard;
