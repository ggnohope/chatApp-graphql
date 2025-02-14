import { gql, useSubscription } from "@apollo/client";
import { Message } from "../../models/message";
import { updateMessagesCache } from "../utils/updateMessagesCache";
import { MESSAGE_FRAGMENT } from "../../fragments/message.fragment";
import { updateLatestMessageCache } from "../utils/updateLatestMessage";

interface ReturnedData {
  messageCreated: Message;
}

const MESSAGE_CREATED = gql`
  subscription MessageCreated($chatIds: [String!]!) {
    messageCreated(chatIds: $chatIds) {
      ...MessageFields
    }
  }
  ${MESSAGE_FRAGMENT}
`;

export const useMessageCreated = ({ chatIds }: { chatIds: string[] }) => {
  return useSubscription<ReturnedData>(MESSAGE_CREATED, {
    variables: { chatIds },
    onData: ({ client, data }) => {
      if (data.data) {
        updateMessagesCache(client.cache, data.data.messageCreated);
        updateLatestMessageCache(client.cache, data.data.messageCreated);
      }
    },
  });
};
