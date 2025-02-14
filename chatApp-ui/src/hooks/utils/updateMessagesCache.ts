import { ApolloCache } from "@apollo/client";
import { Message } from "../../models/message";
import { GET_MESSAGES } from "../message/useGetMessages";
import { PAGE_SIZE } from "../../constants";

export const updateMessagesCache = (
  cache: ApolloCache<object>,
  message: Message
) => {
  const messages = cache.readQuery<{ messages: Message[] }>({
    query: GET_MESSAGES,
    variables: {
      chatId: message.chatId,
    },
  });

  cache.writeQuery({
    query: GET_MESSAGES,
    variables: {
      chatId: message.chatId,
      skip: 0,
      limit: PAGE_SIZE,
    },
    data: {
      messages: [message, ...(messages?.messages || [])],
    },
  });
};
