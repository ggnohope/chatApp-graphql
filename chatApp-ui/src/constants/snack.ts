import { makeVar } from "@apollo/client";
import { SnackMessage } from "../interfaces";

export const snackVar = makeVar<SnackMessage | undefined>(undefined);
