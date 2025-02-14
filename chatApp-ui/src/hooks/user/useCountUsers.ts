import { useCallback, useState } from "react";
import { snackVar } from "../../constants/snack";

export const useCountUsers = () => {
  const [count, setCount] = useState<number | undefined>();

  const countUsers = useCallback(async () => {
    const res = await fetch(
      `http://${import.meta.env.VITE_API_URL}/users/count`,
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
        message: "Erorr occured when getting the total users number",
        type: "error",
      });
    }
    setCount(parseInt(await res.text()));
  }, []);

  return { count, countUsers };
};
