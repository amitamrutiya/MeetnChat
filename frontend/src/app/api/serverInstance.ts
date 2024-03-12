import axios from "axios";

export const serverInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_API_URL,
  responseType: "json",
});

export const joinGroupVideoRoom = async (payload: {
  fullname: string;
  email: string;
  roomCode: string;
}) => {
  const { data } = await serverInstance.post("/room/join", payload);
  return data as { id: string; token: string };
};
