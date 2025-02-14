import { Abstract } from "./abstract";
import { Message } from "./message";

export interface Chat extends Abstract {
  _id: string;
  name: string;
  latestMessage: Message;
}
