import Auth from ".";
import { useLogin } from "../../hooks/auth/useLogin";

const Login = () => {
  const { login } = useLogin();

  const onSubmit = async (field: { email: string; password: string }) => {
    login(field);
  };

  return <Auth isLogin onSubmit={onSubmit} />;
};

export default Login;
