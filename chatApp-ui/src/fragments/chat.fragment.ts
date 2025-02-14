import { gql } from "@apollo/client";
import { MESSAGE_FRAGMENT } from "./message.fragment";

export const CHAT_FRAGMENT = gql`
  fragment ChatFields on Chat {
    _id
    name
    latestMessage {
      ...MessageFields
    }
  }
  ${MESSAGE_FRAGMENT}
`;
