import { Abstract } from "./abstract";
import { User } from "./user";

export interface Message extends Abstract {
  content: string;
  createdAt: string;
  updatedAt: string;
  chatId: string;
  user: User;
}
