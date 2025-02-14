import { gql, useQuery } from "@apollo/client";
import { Chat } from "../../models/chat";
import { CHAT_FRAGMENT } from "../../fragments/chat.fragment";

interface ReturnedData {
  chat: Chat;
}

export const GET_CHAT = gql`
  query Chat($_id: String!) {
    chat(_id: $_id) {
      ...ChatFields
    }
  }
  ${CHAT_FRAGMENT}
`;

export const useGetChat = (_id: string) => {
  return useQuery<ReturnedData>(GET_CHAT, { variables: { _id } });
};
