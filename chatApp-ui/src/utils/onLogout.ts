import { client } from "../constants/apolloClient";
import { authenticatedVar } from "../constants/authenticated";
import { excludedRoutes } from "../constants/excludedRoutes";
import router from "../routes";

const onLogout = () => {
  authenticatedVar(false);
  localStorage.removeItem("accessToken");
  if (!excludedRoutes.includes(window.location.pathname)) {
    router.navigate("/login");
    client.resetStore();
  }
};

export { onLogout };
