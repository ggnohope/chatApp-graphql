import { gql, useQuery } from "@apollo/client";
import { Chat } from "../../models/chat";
import { CHAT_FRAGMENT } from "../../fragments/chat.fragment";
import { PaginationArgs } from "../../interfaces";

interface ReturnedData {
  chats: Chat[];
}

export const GET_CHATS = gql`
  query Chats($skip: Int!, $limit: Int!) {
    chats(skip: $skip, limit: $limit) {
      ...ChatFields
    }
  }
  ${CHAT_FRAGMENT}
`;

export const useGetChats = (variables: PaginationArgs) => {
  return useQuery<ReturnedData>(GET_CHATS, { variables });
};
