import { useCallback, useState } from "react";
import { snackVar } from "../../constants/snack";

export const useCountMessages = ({ chatId }: { chatId: string }) => {
  const [count, setCount] = useState<number | undefined>();

  const countMessages = useCallback(async () => {
    const res = await fetch(
      `http://${import.meta.env.VITE_API_URL}/messages/count?chatId=${chatId}`,
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
        message: "Erorr occured when getting the total messages number",
        type: "error",
      });
    }
    setCount(parseInt(await res.text()));
  }, [chatId]);

  return { count, countMessages };
};
