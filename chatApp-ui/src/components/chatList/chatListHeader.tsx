import { AddCircle } from "@mui/icons-material";
import { AppBar, Divider, IconButton, Toolbar } from "@mui/material";

interface ChatListHeaderProps {
  handleOpen: () => void;
}

const ChatListHeader = ({ handleOpen }: ChatListHeaderProps) => {
  return (
    <>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <IconButton onClick={handleOpen} size="large">
            <AddCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Divider />
    </>
  );
};

export default ChatListHeader;
