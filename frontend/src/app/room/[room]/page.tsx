/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Socket } from "socket.io-client";
import { useParams } from "next/navigation";
import { SocketContext } from "@/app/context/SocketContext";
import { MediaStreamContext, ProviderProps } from "@/app/context/MediaStream";
import { useUser } from "@auth0/nextjs-auth0/client";
import { serverInstance } from "@/app/api/serverInstance";
import { IncomingCall, User } from "@/type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import peerService from "@/service/peer";
import Dashboard from "@/components/dashboard";

export default function Room() {
  const [users, setUsers] = useState<User[]>([]);
  const {
    setUserMediaStream,
    setRemoteMediaStream,
    remoteStreams,
    userStream,
  } = React.useContext(MediaStreamContext) as ProviderProps;
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
    console.log("Refreshing user list");
    const { data } = await serverInstance.get("/users");
    if (data.users) {
      console.log(data.users);
      setUsers(data.users);
    }
  }, []);

  const joinRoom = useCallback(async () => {
    console.log("Joining room");
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

  const handleClickUser = useCallback(async (user: User) => {
    console.log("Calling user", user);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peerService.getOffer();
    if (offer) {
      socket.emit("peer:call", {
        to: user.socketId,
        offer,
        roomId,
      });
    }
    if (stream && setUserMediaStream) setUserMediaStream(stream);
    setCalledToUserId(user.socketId);
  }, []);

  const handleIncommingCall = useCallback(async (data: IncomingCall) => {
    console.log("Incomming call", data);
    if (data) {
      setIncommingCallData(data);
    }
  }, []);

  const handleAcceptIncommingCall = useCallback(async () => {
    console.log("Accepting incomming call" + incommingCallData);
    if (!incommingCallData) return;
    const { from, user, offer, roomId } = incommingCallData;
    if (offer) {
      const answer = await peerService.getAnswer(offer);
      if (answer) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });
          if (stream && setUserMediaStream) setUserMediaStream(stream);
        } catch (error) {
          console.error("Error getting user media", error);
        }
        socket.emit("peer:call:accepted", { to: from, offer: answer, roomId });
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

  const handleRejectIncommingCall = useCallback(
    () => setIncommingCallData(undefined),
    []
  );

  const handleCallAccepted = useCallback(async (data: any) => {
    console.log("Call accepted", data);
    const { offer, from, user, roomId } = data;

    await peerService.setRemoteDesc(offer);
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
  }, []);

  const sendStreams = useCallback(() => {
    for (const track of userStream!.getTracks()) {
      peerService.peer?.addTrack(track, userStream!);
    }
  }, [userStream]);

  const handleNegosiation = useCallback(
    async (ev: Event) => {
      console.log("Handle negosiation");
      const offer = await peerService.getOffer();
      socket.emit("peer:negotiate", {
        to: peerService.remoteSocketId,
        offer,
      });
    },
    [remoteSocketId]
  );

  const handleRequiredPeerNegotiate = useCallback(async (data: any) => {
    console.log("Required peer negosiate", data);
    const { from, offer } = data;
    if (offer) {
      const answer = await peerService.getAnswer(offer);
      socket.emit("peer:negosiate:result", { to: from, offer: answer });
    }
  }, []);

  const handleRequiredPeerNegotiateFinalResult = useCallback(
    async (data: any) => {
      console.log("Required peer negosiate final result", data);
      const { from, offer } = data;
      if (offer) {
        await peerService.setRemoteDesc(offer);
      }
    },
    []
  );

  useEffect(() => {
    peerService.remoteSocketId = remoteSocketId;
  }, [remoteSocketId]);

  useEffect(() => {
    joinRoom();
  }, [currentUser]);

  useEffect(() => {
    handleRefreshUserList();
    peerService.init();
    peerService?.peer?.addEventListener("negotiationneeded", handleNegosiation);

    if (peerService.peer) {
      peerService.peer.addEventListener("track", async (ev) => {
        const remoteStream = ev.streams;
        if (remoteStream && setRemoteMediaStream) {
          setRemoteMediaStream([...remoteStreams, remoteStream[0]]);
        }
      });
      peerService.peer.addEventListener("ended", async (ev) => {});
    }

    return () => {
      peerService?.peer?.removeEventListener(
        "negotiationneeded",
        handleNegosiation
      );
    };
  }, [remoteStreams]);

  useEffect(() => {
    socket.on("refresh:user-list", handleRefreshUserList);
    socket.on("peer:incomming-call", handleIncommingCall);
    socket.on("peer:call:accepted", handleCallAccepted);
    socket.on("peer:negotiate", handleRequiredPeerNegotiate);
    socket.on("peer:negosiate:result", handleRequiredPeerNegotiateFinalResult);

    return () => {
      socket.off("refresh:user-list", handleRefreshUserList);
      socket.off("peer:incomming-call", handleIncommingCall);
      socket.off("peer:call:accepted", handleCallAccepted);
      socket.off("peer:negotiate", handleRequiredPeerNegotiate);
      socket.off(
        "peer:negosiate:result",
        handleRequiredPeerNegotiateFinalResult
      );
    };
  }, []);

  return (
    <div className="min-h-screen justify-center bg-[#18181b] p-5">
      <h1>Room Page</h1>
      {users.length > 0 &&
        users.map((user, index) => (
          <div
            key={`${user.name}-${index}`}
            onClick={() => handleClickUser(user)}
          >
            <Avatar>
              <AvatarImage src={user.picture ?? ""} />
              <AvatarFallback>{user.name}</AvatarFallback>
            </Avatar>
          </div>
        ))}
      {userStream && <button onClick={sendStreams}>Send Stream</button>}
      {/* {remoteSocketId && (
        <button onClick={() => handleClickUser(users[1])}>CALL</button>
      )} */}
      {incommingCallData && (
        <div>
          <h1>Incomming Call</h1>
          <button onClick={handleAcceptIncommingCall}>Accept</button>
          <button onClick={handleRejectIncommingCall}>Reject</button>
        </div>
      )}
      {userStream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={userStream}
          />
        </>
      )}
      {remoteStreams && (
        <>
          <h1>Remote Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={remoteStreams[0]}
          />
        </>
      )}
      {/* {!remoteSocketId && (
        <div className="flex min-h-[80vh] w-full items-center justify-center text-white">
          {users &&
            users
              .filter(
                (e) => e.name !== `${currentUser?.name} - ${currentUser?.email}`
              )
              .map((user, index) => (
                <div
                  key={`${user.name}-${index}`}
                  onClick={() => handleClickUser(user)}
                  className={
                    calledToUserId && calledToUserId === user.socketId
                      ? `border-collapse rounded-3xl border-0 border-dashed border-sky-400 motion-safe:animate-bounce`
                      : ""
                  }
                >
                  <Avatar>
                    <AvatarImage src={user.picture ?? ""} />
                    <AvatarFallback>{user.name}</AvatarFallback>
                  </Avatar>
                </div>
              ))}
          {(!users ||
            users.filter(
              (e) => e.name !== `${currentUser?.name} - ${currentUser?.email}`
            ).length <= 0) && (
            <h2 className="font-sans text-slate-400 opacity-70 motion-safe:animate-bounce">
              Join by opening this on other tab
            </h2>
          )}
        </div>
      )} */}

      {/* {incommingCallData && (
        <div className="fixed bottom-0 right-0 p-5">
          <div className="flex items-center justify-center">
            <h6 className="font-sans text-slate-400">
              {incommingCallData.user.name} is calling you
            </h6>
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={handleAcceptIncommingCall}
              className="bg-green-500 p-2 rounded-md m-2"
            >
              Accept
            </button>
            <button
              onClick={handleRejectIncommingCall}
              className="bg-red-500 p-2 rounded-md m-2"
            >
              Reject
            </button>
          </div>
        </div>
      )}
      {!remoteSocketId && (
        <div className="flex items-center justify-center">
          <h6 className="font-sans text-slate-400">
            Tip: Click on user to make call
          </h6>
        </div>
      )} */}
    </div>
  );
}
