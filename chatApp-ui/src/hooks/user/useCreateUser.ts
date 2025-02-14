import { gql, useMutation } from "@apollo/client";
import { User } from "../../models/user";

interface CreateUserInput {
  createUserData: {
    email: string;
    username: string;
    password: string;
  };
}

const CREATE_USER = gql`
  mutation CreateUser($createUserData: CreateUserInput!) {
    createUser(createUserInput: $createUserData) {
      _id
      email
      username
    }
  }
`;

export const useCreateUser = () => {
  return useMutation<User, CreateUserInput>(CREATE_USER);
};
