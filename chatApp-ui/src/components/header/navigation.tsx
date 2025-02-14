import { Box, Button } from "@mui/material";
import { Page } from "../../interfaces";
import router from "../../routes";

interface NavigationProps {
  pages: Page[];
}

const Navigation = ({ pages }: NavigationProps) => {
  return (
    <>
      <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
        {pages.map((page) => (
          <Button
            onClick={() => {
              router.navigate(page.path);
            }}
            key={page.title}
            sx={{ my: 2, color: "white", display: "block" }}
          >
            {page.title}
          </Button>
        ))}
      </Box>
    </>
  );
};

export default Navigation;
