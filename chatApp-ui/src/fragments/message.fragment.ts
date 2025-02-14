import { gql } from "@apollo/client";

export const MESSAGE_FRAGMENT = gql`
  fragment MessageFields on Message {
    _id
    content
    createdAt
    chatId
    user {
      _id
      email
      username
      profileImage
    }
  }
`;
