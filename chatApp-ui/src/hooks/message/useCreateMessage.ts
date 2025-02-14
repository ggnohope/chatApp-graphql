import { gql, useMutation } from "@apollo/client";
import { Message } from "../../models/message";
import { updateMessagesCache } from "../utils/updateMessagesCache";
import { MESSAGE_FRAGMENT } from "../../fragments/message.fragment";
import { updateLatestMessageCache } from "../utils/updateLatestMessage";

interface CreateMessageInput {
  createMessageData: {
    content: string;
    chatId: string;
  };
}

interface ReturnedData {
  createMessage: Message;
}

const CREATE_MESSAGE = gql`
  mutation CreateMessage($createMessageData: CreateMessageInput!) {
    createMessage(createMessageInput: $createMessageData) {
      ...MessageFields
    }
  }
  ${MESSAGE_FRAGMENT}
`;

export const useCreateMessage = () => {
  return useMutation<ReturnedData, CreateMessageInput>(CREATE_MESSAGE, {
    update(cache, { data }) {
      if (data?.createMessage) {
        updateMessagesCache(cache, data.createMessage);
        updateLatestMessageCache(cache, data.createMessage);
      }
    },
  });
};
