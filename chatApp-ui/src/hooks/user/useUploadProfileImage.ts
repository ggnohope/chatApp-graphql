import { useState } from "react";
import { snackVar } from "../../constants/snack";

export const useUploadProfileImage = () => {
  const [profileImage, setProfileImage] = useState<string | undefined>(
    undefined
  );

  const uploadProfileImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `http://${import.meta.env.VITE_API_URL}/users/profile-image`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      const responseData = await res.json();
      setProfileImage(responseData.profileImage);
    } catch (error) {
      snackVar({ message: `Error uploading image: ${error}`, type: "error" });
    }
  };

  return { profileImage, setProfileImage, uploadProfileImage };
};
