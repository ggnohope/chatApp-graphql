import { gql, useQuery } from "@apollo/client";

interface ReturnedData {
  me: {
    _id: string;
    email: string;
    username: string;
    profileImage: string;
  };
}

const GET_ME = gql`
  query Me {
    me {
      _id
      email
      username
    }
  }
`;

const useGetMe = () => {
  return useQuery<ReturnedData>(GET_ME);
};

export { useGetMe };
