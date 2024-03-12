/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useParams } from "next/navigation";
import { SocketContext } from "@/app/context/SocketContext";
import { UserProfile, useUser } from "@auth0/nextjs-auth0/client";
import { serverInstance } from "@/app/api/serverInstance";
import { IncomingCall, User } from "@/type";
import ReactPlayer from "react-player";
import peerService from "@/service/peer";

export default function Room() {
  const [users, setUsers] = useState<User[]>([]);
  const [stream, setStream] = useState<MediaStream>();
  const [calledToUserId, setCalledToUserId] = useState<string | undefined>();
  const [incommingCallData, setIncommingCallData] = React.useState<
    IncomingCall | undefined
  >();
  const [remoteSocketId, setRemoteSocketId] = React.useState<
    string | undefined
  >();

  const [remoteUser, setRemoteUser] = React.useState<undefined | null | User>();

  const currentUser = useUser().user;
  const socket = useContext(SocketContext) as Socket;
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

  const handleClickUser = useCallback(async (user: User) => {
    const offer = await peerService.getOffer();
    if (offer) {
      socket.emit("peer:call", {
        to: user.socketId,
        offer,
        roomId,
      });
    }
    setCalledToUserId(user.socketId);
  }, []);

  const handleIncommingCall = React.useCallback(async (data: IncomingCall) => {
    if (data) {
      setIncommingCallData(data);
    }
  }, []);

  const handleAcceptIncommingCall = React.useCallback(async () => {
    if (!incommingCallData) return;
    const { from, user, offer,roomId} = incommingCallData;
    if (offer) {
      const answer = await peerService.getAnswer(offer);
      if (answer) {
        socket.emit("peer:call:accepted", { to: from, offer: answer });
        setRemoteUser({
          roomId,
          sid: user.sid,
          picture: user.picture,
          nickname: user.nickname,
          name: user.name,
          email_verified: user.email_verified,
          email: user.email,
          isConnected: true,
          joinedAt: new Date(),
          socketId: from,
        });
        setRemoteSocketId(from);
      }
    }
  }, [incommingCallData]);

  useEffect(() => {
    joinRoom();
  }, [currentUser]);

  useEffect(() => {
    handleRefreshUserList();
    peerService.init();
    return () => {};
  }, []);

  useEffect(() => {
    socket.on("refresh:user-list", handleRefreshUserList);
    socket.on("peer:incomming-call", handleIncommingCall);

    return () => {
      socket.off("refresh:user-list", handleRefreshUserList);
      socket.off("peer:incomming-call", handleIncommingCall);
    };
  }, []);
  return (
    <>
      {users.length > 0 ? (
        <div>
          <h1>Users in the room</h1>
          {users.map((user) => (
            <button key={user.sid} onClick={() => handleClickUser(user)}>
              {user.name ?? "No name"}
            </button>
          ))}
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
