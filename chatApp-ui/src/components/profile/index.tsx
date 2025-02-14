import {
  Avatar,
  Button,
  Stack,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useGetMe } from "../../hooks/user/useGetMe";
import { UploadFile } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useUploadProfileImage } from "../../hooks/user/useUploadProfileImage";
import { useGetProfileImage } from "../../hooks/user/useGetProfileImage";

const Profile = () => {
  const { data } = useGetMe();
  const profileImageFromApi = useGetProfileImage();
  const { profileImage, setProfileImage, uploadProfileImage } =
    useUploadProfileImage();
  const [tempImage, setTempImage] = useState<string | undefined>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);

    setTempImage(imageUrl);
    setSelectedFile(file);
    setOpenDialog(true);

    event.target.value = "";
  };

  const handleSave = async () => {
    if (selectedFile) {
      await uploadProfileImage(selectedFile);
    }
    setOpenDialog(false);
  };

  const handleCancel = () => {
    setTempImage(undefined);
    setSelectedFile(null);
    setOpenDialog(false);
  };

  useEffect(() => {
    if (profileImageFromApi) {
      setProfileImage(profileImageFromApi);
    }
  }, [profileImageFromApi, setProfileImage]);

  return (
    <Stack
      spacing={6}
      sx={{
        marginTop: "2.5rem",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h3">{data?.me.username}</Typography>
      <Avatar sx={{ height: 256, width: 256 }} src={profileImage} />
      <Button
        component="label"
        variant="contained"
        size="large"
        startIcon={<UploadFile />}
      >
        Upload Image
        <input type="file" hidden onChange={handleUploadFile} />
      </Button>
      <Dialog open={openDialog} onClose={handleCancel}>
        <DialogTitle>Confirm Profile Image</DialogTitle>
        <DialogContent>
          <Avatar sx={{ height: 256, width: 256 }} src={tempImage} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Profile;
