import { gql, useMutation } from "@apollo/client";
import { Chat } from "../../models/chat";
import { GET_CHATS } from "./useGetChats";
import { CHAT_FRAGMENT } from "../../fragments/chat.fragment";
import { PAGE_SIZE } from "../../constants";

interface CreateChatInput {
  createChatData: {
    name: string;
    isPrivate: boolean;
    userIds?: string[];
  };
}

interface ReturnedData {
  createChat: Chat;
}

const CREATE_CHAT = gql`
  mutation CreateChat($createChatData: CreateChatInput!) {
    createChat(createChatInput: $createChatData) {
      ...ChatFields
    }
  }
  ${CHAT_FRAGMENT}
`;

export const useCreateChat = () => {
  return useMutation<ReturnedData, CreateChatInput>(CREATE_CHAT, {
    refetchQueries: [
      { query: GET_CHATS, variables: { skip: 0, limit: PAGE_SIZE } },
    ],
  });
};
