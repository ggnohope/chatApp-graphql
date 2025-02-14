import { Button, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMe } from "../../hooks/user/useGetMe";

interface AuthProps {
  isLogin: boolean;
  onSubmit: (field: { email: string; password: string }) => void;
  extraFields?: React.ReactNode;
}

const Auth: React.FC<AuthProps> = ({ isLogin, onSubmit, extraFields }) => {
  const [field, setField] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { data } = useGetMe();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setField({
      ...field,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(field);
  };

  useEffect(() => {
    if (data) {
      navigate("/");
    }
  }, [data, navigate]);

  return (
    <Stack
      onSubmit={handleSubmit}
      component="form"
      spacing={3}
      className="h-[100vh] max-w-[50%] mx-auto flex justify-center"
    >
      <TextField
        label="Email"
        name="email"
        type="email"
        variant="outlined"
        value={field.email}
        onChange={handleChange}
        required
      />
      {extraFields}
      <TextField
        label="Password"
        name="password"
        type="password"
        variant="outlined"
        value={field.password}
        onChange={handleChange}
        required
      />
      {isLogin ? (
        <Button type="submit" variant="contained">
          Login
        </Button>
      ) : (
        <Button type="submit" variant="contained">
          Sign Up
        </Button>
      )}
      {isLogin ? (
        <div className="flex justify-center">
          <p className="text-sm mt-4 ">
            Dont have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-indigo-600 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      ) : (
        <div className="flex justify-center">
          <p className="text-sm mt-4 ">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-indigo-600 hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      )}
    </Stack>
  );
};

export default Auth;
