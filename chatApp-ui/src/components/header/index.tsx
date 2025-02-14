import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Branding from "./branding";
import MobileNavigation from "./mobileNavigation";
import Navigation from "./navigation";
import Settings from "./settings";
import { useReactiveVar } from "@apollo/client";
import { authenticatedVar } from "../../constants/authenticated";
import { Page } from "../../interfaces";

const pages: Page[] = [
  {
    title: "Home",
    path: "/",
  },
];

const unauthenticatedPages: Page[] = [
  {
    title: "Login",
    path: "/login",
  },
  {
    title: "Sign Up",
    path: "/signup",
  },
];

function Header() {
  const authenticated = useReactiveVar(authenticatedVar);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Branding
            variant="h6"
            display={{ xs: "none", md: "flex" }}
            href="#app-bar-with-responsive-menu"
          />
          <MobileNavigation
            pages={authenticated ? pages : unauthenticatedPages}
          />
          <Branding
            variant="h5"
            display={{ xs: "flex", md: "none" }}
            href="#app-bar-with-responsive-menu"
          />
          <Navigation pages={authenticated ? pages : unauthenticatedPages} />
          {authenticated && <Settings />}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
