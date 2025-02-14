import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  InputBase,
  Modal,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { useCreateChat } from "../../hooks/chat/useCreateChat";
import router from "../../routes";
import { useGetUsers } from "../../hooks/user/useGetUsers";
import { PAGE_SIZE } from "../../constants";
import { useCountUsers } from "../../hooks/user/useCountUsers";
import { User } from "../../models/user";
import InfiniteScroll from "react-infinite-scroller";
import { useReactiveVar } from "@apollo/client";
import { authenticatedVar } from "../../constants/authenticated";

interface ChatListAddModalProps {
  open: boolean;
  handleClose: () => void;
}

const AddChatModal = ({ open, handleClose }: ChatListAddModalProps) => {
  const [name, setName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [createChat] = useCreateChat();
  const [isSearching, setIsSearching] = useState(false);
  const authenticated = useReactiveVar(authenticatedVar);

  const { count, countUsers } = useCountUsers();
  const {
    data: users,
    fetchMore,
    refetch,
  } = useGetUsers({
    search: "",
    skip: 0,
    limit: PAGE_SIZE,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      try {
        await refetch({
          search: value,
          skip: 0,
          limit: PAGE_SIZE,
        });
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [refetch]
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setIsSearching(true);
    debouncedSearch(value);
  };

  const handleUserSelect = (user: User) => {
    if (!selectedUsers.find((u) => u.username === user.username)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearch("");
    refetch({
      search: "",
      skip: 0,
      limit: PAGE_SIZE,
    });
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
  };

  const onSubmit = async () => {
    try {
      const chat = await createChat({
        variables: {
          createChatData: {
            name,
            isPrivate,
            userIds: selectedUsers.map((user) => user._id),
          },
        },
      });
      handleClose();
      setName("");
      setSelectedUsers([]);
      setSearch("");
      // Reset search results
      refetch({
        search: "",
        skip: 0,
        limit: PAGE_SIZE,
      });

      if (chat.data?.createChat._id) {
        router.navigate(`/chats/${chat.data.createChat._id}`);
      }
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  useEffect(() => {
    if (authenticated) countUsers();
  }, [countUsers, authenticated]);

  useEffect(() => {
    if (!open) {
      setSearch("");
      // Reset search results when modal closes
      refetch({
        search: "",
        skip: 0,
        limit: PAGE_SIZE,
      });
    }
  }, [open, refetch]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 2,
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Add Chat
          </Typography>
          <FormGroup>
            <FormControlLabel
              style={{ width: 0 }}
              control={
                <Switch
                  checked={isPrivate}
                  onChange={() => setIsPrivate(!isPrivate)}
                />
              }
              label="Private"
            />
          </FormGroup>
          {isPrivate && (
            <>
              <TextField
                fullWidth
                label="Search Users"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                InputProps={{
                  endAdornment: isSearching && (
                    <CircularProgress color="inherit" size={20} />
                  ),
                }}
              />

              {/* Search Results */}
              {search && (
                <Paper
                  sx={{
                    maxHeight: 200,
                    overflow: "auto",
                    display: search ? "block" : "none",
                  }}
                >
                  <InfiniteScroll
                    pageStart={0}
                    loadMore={() =>
                      fetchMore({
                        variables: {
                          skip: users?.users.length,
                          limit: PAGE_SIZE,
                          search: search,
                        },
                      })
                    }
                    hasMore={
                      users?.users && count ? users.users.length < count : false
                    }
                    useWindow={false}
                    threshold={50}
                  >
                    <Stack>
                      {users?.users.map((user) => (
                        <Button
                          key={user._id}
                          onClick={() => handleUserSelect(user)}
                          fullWidth
                          sx={{
                            justifyContent: "flex-start",
                            px: 2,
                            py: 1,
                            "&:hover": {
                              backgroundColor: "action.hover",
                            },
                          }}
                        >
                          {user.username}
                        </Button>
                      ))}
                    </Stack>
                  </InfiniteScroll>
                </Paper>
              )}

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selectedUsers.map((user) => (
                  <Chip
                    key={user._id}
                    label={user.username}
                    onDelete={() => handleRemoveUser(user._id)}
                  />
                ))}
              </Box>
            </>
          )}

          <Paper
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              height: 60,
            }}
          >
            <InputBase
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ ml: 1, flex: 1 }}
              placeholder="Group Name"
            />
          </Paper>

          <Button onClick={onSubmit} variant="outlined">
            Save
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddChatModal;
