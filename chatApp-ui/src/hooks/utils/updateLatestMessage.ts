import { ApolloCache } from "@apollo/client";
import { Message } from "../../models/message";
import { Chat } from "../../models/chat";
import { GET_CHATS } from "../chat/useGetChats";

export const updateLatestMessageCache = (
  cache: ApolloCache<object>,
  message: Message
) => {
  const chats = [
    ...(cache.readQuery<{ chats: Chat[] }>({
      query: GET_CHATS,
    })?.chats || []),
  ];

  if (!chats || chats.length === 0) return;

  const updateChatIndex = chats.findIndex(
    (chat) => chat._id === message.chatId
  );

  if (updateChatIndex === -1) return;

  const updateChat = chats[updateChatIndex];
  const updateChatCopy = { ...updateChat };
  updateChatCopy.latestMessage = message;
  chats[updateChatIndex] = updateChatCopy;

  cache.writeQuery({
    query: GET_CHATS,
    data: {
      chats,
    },
  });
};
