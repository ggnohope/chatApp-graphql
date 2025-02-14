// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractErrorMessage = (error: any) => {
  const errorMessage =
    error.graphQLErrors[0]?.extensions?.originalError?.message;

  if (Array.isArray(errorMessage)) {
    return errorMessage[0];
  }
  return errorMessage;
};

export { extractErrorMessage };
