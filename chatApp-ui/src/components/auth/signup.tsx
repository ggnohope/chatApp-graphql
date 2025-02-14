import { useEffect, useState } from "react";
import Auth from ".";
import { useCreateUser } from "../../hooks/user/useCreateUser";
import { useLogin } from "../../hooks/auth/useLogin";
import { snackVar } from "../../constants/snack";
import { TextField } from "@mui/material";

const SignUp = () => {
  const [createUser, { error }] = useCreateUser();
  const { login } = useLogin();
  const [username, setUsername] = useState("");
  const onSubmit = async (field: { email: string; password: string }) => {
    await createUser({
      variables: {
        createUserData: {
          email: field.email,
          username: username,
          password: field.password,
        },
      },
    });
    login({ email: field.email, password: field.password });
  };

  useEffect(() => {
    if (error) {
      snackVar({ message: error.message, type: "error" });
    }
  }, [error]);

  return (
    <Auth
      isLogin={false}
      onSubmit={onSubmit}
      extraFields={
        <TextField
          label="Username"
          name="username"
          type="text"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      }
    />
  );
};

export default SignUp;
