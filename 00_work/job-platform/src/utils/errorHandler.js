import { destroyCookie } from "nookies";
import { handleLogout } from "./helpers";

export const errorHandler = (error) => {
  if (error?.response?.status === 401) {
    // logout
    handleLogout();
  }
};
