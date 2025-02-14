import { Abstract } from "./abstract";

export interface User extends Abstract {
  email: string;
  username: string;
  password: string;
  profileImage: string;
}
