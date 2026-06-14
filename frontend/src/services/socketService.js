import { io } from "socket.io-client";

let socket;

const getServerUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
  return apiUrl.replace(/\/api$/, "");
};

export const initSocket = (token) => {
  if (!socket) {
    socket = io(getServerUrl(), {
      auth: { token },
      withCredentials: true,
    });
  }
  return socket;
};

export const getSocket = () => {
  return socket;
};
