import { gql, useQuery } from "@apollo/client";
import { User } from "../../models/user";

interface ReturnedData {
  users: User[];
}

interface Variables {
  search?: string;
  skip?: number;
  limit?: number;
}

const GET_USERS = gql`
  query Users($search: String, $skip: Int!, $limit: Int!) {
    users(search: $search, skip: $skip, limit: $limit) {
      _id
      email
      username
    }
  }
`;

const useGetUsers = ({
  search,
  skip = 0,
  limit = 10,
}: {
  search?: string;
  skip: number;
  limit: number;
}) => {
  return useQuery<ReturnedData, Variables>(GET_USERS, {
    variables: { search, skip, limit },
  });
};

export { useGetUsers };
