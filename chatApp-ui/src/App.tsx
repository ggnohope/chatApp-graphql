import { CssBaseline, ThemeProvider } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import darkTheme from "./theme";
import { ApolloProvider } from "@apollo/client";
import { client } from "./constants/apolloClient";
import Guard from "./components/auth/guard";
import Header from "./components/header";
import SnackBar from "./components/snackbar";
import ChatList from "./components/chatList";
import { usePath } from "./hooks/utils/usePath";

function App() {
  const { path } = usePath();

  const showChatList = path === "/" || path.includes("/chats");

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline>
          <Header />
          <Guard>
            {showChatList ? (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4, lg: 3, xl: 3 }}>
                  <ChatList />
                </Grid>
                <Grid size={{ xs: 12, md: 8, lg: 9, xl: 9 }}>
                  <RouterProvider router={router} />
                </Grid>
              </Grid>
            ) : (
              <RouterProvider router={router} />
            )}
          </Guard>
          <SnackBar />
        </CssBaseline>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
