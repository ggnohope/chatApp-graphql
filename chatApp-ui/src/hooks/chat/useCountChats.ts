import { useCallback, useState } from "react";
import { snackVar } from "../../constants/snack";

export const useCountChats = () => {
  const [count, setCount] = useState<number | undefined>();

  const countChats = useCallback(async () => {
    const res = await fetch(
      `http://${import.meta.env.VITE_API_URL}/chats/count`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      snackVar({
        message: "Erorr occured when getting the total chats number",
        type: "error",
      });
    }
    setCount(parseInt(await res.text()));
  }, []);

  return { count, countChats };
};
