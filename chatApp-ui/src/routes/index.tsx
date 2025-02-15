import { createBrowserRouter } from "react-router-dom";

import Login from "../components/auth/login";
import SignUp from "../components/auth/signup";
import Home from "../components/home";
import Chat from "../components/chat";
import Profile from "../components/profile";
import GoogleCallback from "../components/auth/googleCallback";

const router = createBrowserRouter([
  {
    path: "/auth/google/callback",
    element: <GoogleCallback />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/chats/:_id",
    element: <Chat />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);

export default router;
