import { AlertColor } from "@mui/material";

export interface Page {
  title: string;
  path: string;
}

export interface SnackMessage {
  message: string;
  type: AlertColor;
}

export interface PaginationArgs {
  skip: number;
  limit: number;
}

export interface MessagesPaginationArgs extends PaginationArgs {
  chatId: string;
}
