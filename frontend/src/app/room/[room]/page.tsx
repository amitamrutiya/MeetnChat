/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useParams } from "next/navigation";
import { SocketContext } from "@/app/context/SocketContext";
import { UserProfile, useUser } from "@auth0/nextjs-auth0/client";
import { serverInstance } from "@/app/api/serverInstance";
import { MediaStreamContext, ProviderProps } from "@/app/context/MediaStream";
import ReactPlayer from "react-player";

export default function Room() {
  const [users, setUsers] = React.useState<UserProfile[]>([]);
  const [stream, setStream] = useState<MediaStream>();

  const currentUser = useUser().user;
  const socket = React.useContext(SocketContext) as Socket;
  const params = useParams();
  const roomId = params.room;

  const handleRefreshUserList = useCallback(async () => {
    const { data } = await serverInstance.get("/users");
    if (data.users) {
      console.log(data.users);
      setUsers(data.users);
    }
  }, []);

  const joinRoom = useCallback(async () => {
    try {
      socket.emit("room:join", {
        roomId,
        email: currentUser!.email,
        email_verified: currentUser!.email_verified,
        name: currentUser!.name,
        nickname: currentUser!.nickname,
        picture: currentUser!.picture,
        sid: currentUser!.sid,
      });
    } catch (error) {
      console.error("Error joining room", error);
    }
  }, [currentUser]);

  const handleStartAudioVideoStream = React.useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    if (stream) setStream(stream);
  }, []);

  useEffect(() => {
    joinRoom();
  }, [currentUser]);

  useEffect(() => {
    socket.on("refresh:user-list", handleRefreshUserList);

    return () => {
      socket.off("refresh:user-list", handleRefreshUserList);
    };
  }, []);
  return (
    <>
      {users.length > 0 ? (
        <div>
          <h1>Users in the room</h1>
          <ul>
            {users.map((user) => (
              <li key={user.updated_at}>{user.name ?? "No name"}</li>
            ))}
          </ul>
          <ReactPlayer
            width="300px"
            height="300px"
            url={stream ?? ""}
            playing
            controls={false}
            pip
          />
        </div>
      ) : (
        <div>No users</div>
      )}
    </>
  );
}
