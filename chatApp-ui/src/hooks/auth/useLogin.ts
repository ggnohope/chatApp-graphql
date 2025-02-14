import { client } from "../../constants/apolloClient";
import { snackVar } from "../../constants/snack";

export interface LoginRequest {
  email: string;
  password: string;
}

export const useLogin = () => {
  const login = async (req: LoginRequest) => {
    const res = await fetch(
      `http://${import.meta.env.VITE_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(req),
      }
    );

    if (!res.ok) {
      if (res.status === 401) {
        snackVar({ message: "Credentials are not valid!", type: "error" });
      } else {
        snackVar({ message: "Unknown error occured!", type: "error" });
      }
      return null;
    }

    const data = await res.json();
    localStorage.setItem("accessToken", data.token);

    await client.refetchQueries({ include: "active" });

    return data;
  };

  return { login };
};
