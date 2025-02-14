import { useLocation, useParams } from "react-router-dom";
import { useGetChat } from "../../hooks/chat/useGetChat";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid2,
  IconButton,
  TextField,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useCreateMessage } from "../../hooks/message/useCreateMessage";
import { useEffect, useRef, useState } from "react";
import { useGetMessages } from "../../hooks/message/useGetMessages";
import { PAGE_SIZE } from "../../constants";
import InfiniteScroll from "react-infinite-scroller";
import { useCountMessages } from "../../hooks/message/useCountMessages";
import { useGetMe } from "../../hooks/user/useGetMe";

const Chat = () => {
  const param = useParams();
  const chatId = param._id || "";
  const divRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const [createMessage] = useCreateMessage();
  const [content, setContent] = useState("");
  const { data: chatData } = useGetChat(chatId);
  const { count, countMessages } = useCountMessages({ chatId });
  const { data: user } = useGetMe();
  const { data: messages, fetchMore } = useGetMessages({
    chatId,
    skip: 0,
    limit: PAGE_SIZE,
  });

  const scrollToBottom = () => divRef.current?.scrollIntoView();

  const onSubmit = async () => {
    await createMessage({
      variables: { createMessageData: { content, chatId: param._id || "" } },
    });
    setContent("");
    scrollToBottom();
  };

  useEffect(() => {
    countMessages();
  }, [countMessages]);

  useEffect(() => {
    if (messages?.messages && messages.messages.length <= PAGE_SIZE) {
      setContent("");
      scrollToBottom();
    }
  }, [location, messages]);

  return (
    <>
      <Stack sx={{ height: "100%", justifyContent: "space-between" }}>
        <Toolbar sx={{ padding: "2px", borderBottom: "2px solid black " }}>
          <Paper>
            <Button variant="text" sx={{ color: "white" }}>
              <h1>{chatData?.chat.name}</h1>
            </Button>
          </Paper>
        </Toolbar>
        <Box
          sx={{
            height: "80vh",
            overflow: "auto",
            "::-webkit-scrollbar": {
              width: "8px",
            },
            "::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(211, 211, 211, 0.8)",
              borderRadius: "4px",
            },
          }}
        >
          <InfiniteScroll
            isReverse
            pageStart={0}
            loadMore={() =>
              fetchMore({
                variables: {
                  chatId,
                  skip: messages?.messages.length,
                  limit: PAGE_SIZE,
                },
              })
            }
            hasMore={
              messages && count ? messages.messages.length < count : false
            }
            useWindow={false}
          >
            {messages &&
              [...messages.messages].reverse().map((message) =>
                message.user._id !== user?.me._id ? (
                  <Grid2 container alignItems="center" marginBottom="1rem">
                    <Grid2 size={{ xs: 2, lg: 1 }}>
                      <Stack
                        spacing={1}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Avatar
                          sx={{ width: 52, height: 52 }}
                          src={message.user.profileImage}
                        />
                        <Typography variant="caption">
                          {message.user.username}
                        </Typography>
                      </Stack>
                    </Grid2>
                    <Grid2 size={{ xs: 10, lg: 11 }}>
                      <Stack>
                        <Paper sx={{ width: "fit-content" }}>
                          <Typography sx={{ padding: "0.9rem" }}>
                            {message.content}
                          </Typography>
                        </Paper>
                        <Typography
                          variant="caption"
                          sx={{ padding: "0.25rem" }}
                        >
                          {new Date(message.createdAt).toLocaleTimeString()} -{" "}
                          {new Date(message.createdAt).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    </Grid2>
                  </Grid2>
                ) : (
                  <Grid2 container alignItems="center" marginBottom="1rem">
                    <Grid2 size={{ xs: 10, lg: 11 }}>
                      <Stack>
                        <Paper
                          sx={{ width: "fit-content", marginLeft: "auto" }}
                        >
                          <Typography sx={{ padding: "0.9rem" }}>
                            {message.content}
                          </Typography>
                        </Paper>
                        <Typography
                          variant="caption"
                          sx={{ padding: "0.25rem", marginLeft: "auto" }}
                        >
                          {new Date(message.createdAt).toLocaleTimeString()} -{" "}
                          {new Date(message.createdAt).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    </Grid2>
                    <Grid2 size={{ xs: 2, lg: 1 }}>
                      <Stack
                        spacing={1}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Avatar
                          sx={{ width: 52, height: 52 }}
                          src={message.user.profileImage}
                        />
                        <Typography variant="caption">
                          {message.user.username}
                        </Typography>
                      </Stack>
                    </Grid2>
                  </Grid2>
                )
              )}
            <div ref={divRef}></div>
          </InfiniteScroll>
        </Box>
        <Paper
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <TextField
            sx={{ ml: 1, flex: 1 }}
            placeholder="Message"
            multiline
            variant="standard"
            onChange={(e) => setContent(e.target.value)}
            value={content}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
          />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton color="primary" sx={{ p: "10px" }} onClick={onSubmit}>
            <SendIcon />
          </IconButton>
        </Paper>
      </Stack>
    </>
  );
};

export default Chat;
