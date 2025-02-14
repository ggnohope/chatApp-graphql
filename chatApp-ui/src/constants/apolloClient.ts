import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  from,
  split,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { onLogout } from "../utils/onLogout";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { merge } from "../utils/mergeCache";

const httpLink = createHttpLink({
  uri: `http://${import.meta.env.VITE_API_URL}/graphql`,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://${import.meta.env.VITE_API_URL}/graphql`,
    connectionParams: () => {
      const token = localStorage.getItem("accessToken");
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("accessToken");

  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return forward(operation);
});

const logoutLink = onError((error) => {
  if (
    error.graphQLErrors?.length &&
    (
      error.graphQLErrors[0].extensions as {
        originalError: { statusCode: number };
      }
    ).originalError.statusCode === 401
  ) {
    onLogout();
  }
});

export const client = new ApolloClient({
  link: from([authLink, logoutLink, splitLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          chats: {
            keyArgs: false,
            merge,
          },
          users: {
            keyArgs: false,
            merge,
          },
          messages: {
            keyArgs: ["chatId"],
            merge,
          },
        },
      },
    },
  }),
});
