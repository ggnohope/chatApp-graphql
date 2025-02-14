import { gql, useQuery } from "@apollo/client";
import { Message } from "../../models/message";
import { MESSAGE_FRAGMENT } from "../../fragments/message.fragment";
import { MessagesPaginationArgs } from "../../interfaces";

interface ReturnedData {
  messages: Message[];
}

export const GET_MESSAGES = gql`
  query Messages($chatId: String!, $skip: Int!, $limit: Int!) {
    messages(chatId: $chatId, skip: $skip, limit: $limit) {
      ...MessageFields
    }
  }
  ${MESSAGE_FRAGMENT}
`;

export const useGetMessages = ({
  chatId,
  skip,
  limit,
}: MessagesPaginationArgs) => {
  return useQuery<ReturnedData>(GET_MESSAGES, {
    variables: { chatId, skip, limit },
  });
};
