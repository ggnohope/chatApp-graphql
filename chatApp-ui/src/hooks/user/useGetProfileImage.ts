import { useState, useEffect } from "react";
import { snackVar } from "../../constants/snack";

export const useGetProfileImage = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(
          `http://${import.meta.env.VITE_API_URL}/users/profile-image`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!res.ok) throw new Error("Get image failed");

        const responseData = await res.text();
        setProfileImage(responseData);
      } catch (error) {
        snackVar({ message: `Error getting image: ${error}`, type: "error" });
      }
    };

    fetchImage();
  }, []);

  return profileImage;
};
