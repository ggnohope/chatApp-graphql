import ChatListItem from "./chatListItem";
import { Box, Stack } from "@mui/material";
import ChatListHeader from "./chatListHeader";
import { useEffect, useState } from "react";
import AddChatModal from "./addChatModal";
import { useGetChats } from "../../hooks/chat/useGetChats";
import { usePath } from "../../hooks/utils/usePath";
import { useMessageCreated } from "../../hooks/message/useMessageCreated";
import { PAGE_SIZE } from "../../constants";
import InfiniteScroll from "react-infinite-scroller";
import { useCountChats } from "../../hooks/chat/useCountChats";
import { useReactiveVar } from "@apollo/client";
import { authenticatedVar } from "../../constants/authenticated";

export default function ChatList() {
  const [addChatModalVisible, setAddChatModalVisible] = useState(false);
  const [selectedPath, setSelectedPath] = useState("");
  const { data, fetchMore } = useGetChats({
    skip: 0,
    limit: PAGE_SIZE,
  });
  const { path } = usePath();
  const { count, countChats } = useCountChats();
  const authenticated = useReactiveVar(authenticatedVar);

  useMessageCreated({ chatIds: data?.chats.map((chat) => chat._id) || [] });

  useEffect(() => {
    if (authenticated) countChats();
  }, [countChats, authenticated]);

  useEffect(() => {
    const pathSplit = path.split("chats/");
    if (pathSplit.length === 2) {
      setSelectedPath(pathSplit[1]);
    }
  }, [path]);

  return (
    <>
      <AddChatModal
        open={addChatModalVisible}
        handleClose={() => setAddChatModalVisible(false)}
      />
      <Stack>
        <ChatListHeader handleOpen={() => setAddChatModalVisible(true)} />
        <Box
          sx={{
            padding: 0,
            bgcolor: "background.paper",
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
            pageStart={0}
            loadMore={() =>
              fetchMore({
                variables: {
                  skip: data?.chats.length,
                  limit: PAGE_SIZE,
                },
              })
            }
            hasMore={data?.chats && count ? data.chats.length < count : false}
            useWindow={false}
          >
            {data?.chats &&
              data.chats.map((chat) => (
                <ChatListItem
                  key={chat._id}
                  name={chat.name}
                  _id={chat._id}
                  selected={chat._id === selectedPath}
                  username={chat.latestMessage?.user.username}
                  content={chat.latestMessage?.content}
                />
              ))}
          </InfiniteScroll>
        </Box>
      </Stack>
    </>
  );
}
