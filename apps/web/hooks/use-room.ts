"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import { useParams } from "next/navigation";
import { createHmac } from "crypto";
import { useSession } from "next-auth/react";
import { IncomingCall, User } from "@repo/common";
import { serverInstance } from "../app/api/server-instance";
import peerService from "../app/helpers/peer";
import { useRecoilState, useSetRecoilState } from "recoil";
import { availableFilesAtom, remoteStreamsAtom, SocketContext } from "@repo/store";
import { Socket } from "socket.io-client";

export function useRoom() {
  const { data: sessionData } = useSession();
  // const socket = useConnectSocket();
  const [remoteMediaStreams, setRemoteMediaStream] = useRecoilState(remoteStreamsAtom);
  const setAvailableFiles = useSetRecoilState(availableFilesAtom);
  const { room: roomId } = useParams();

  const [calledToUserId, setCalledToUserId] = useState<string | undefined>();
  const [incomingCallData, setIncomingCallData] = useState<IncomingCall | undefined>();
  const [remoteSocketId, setRemoteSocketId] = useState<string | undefined>();
  const [remoteUser, setRemoteUser] = useState<undefined | User>();
  const [users, setUsers] = useState<User[]>([]);
  const [whiteboardID, setWhiteboardID] = useState<string | null>(null);

  const currentUser = sessionData?.user;
  const secret = "$3#Ia";

  const socket = useContext(SocketContext) as Socket;

  useEffect(() => {
    if (!socket) return;

    socket.on("message", (message) => {
      console.log(message);
    });

    return () => {
      socket.off("message");
    };
  }, [socket]);

  const joinRoom = useCallback(async () => {
    if (!currentUser || !roomId || !socket) return;
    if (process.env.ENVIRONMENT !== "development" && users.some((e) => e.email === currentUser.email)) return;

    console.log("Joining room");
    try {
      socket.emit("room:join", { roomId, ...currentUser });
    } catch (error) {
      console.error("Error joining room", error);
    }
  }, [currentUser, roomId, socket, users]);

  const handleRefreshUserList = useCallback(async () => {
    console.log("Refreshing user list");
    try {
      const { data } = await serverInstance.get("/users");
      console.log("data.users", JSON.stringify(data.users));
      if (data.users) {
        console.log("data.users", data.users.length);
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error refreshing user list", error);
    }
  }, []);

  const handleClickUser = useCallback(
    async (user: User) => {
      if (!socket) return;
      console.log("Calling user", user);
      const offer = await peerService.getOffer();
      if (offer) {
        socket.emit("peer:call", { to: user.socketId, offer, roomId });
        setCalledToUserId(user.socketId);
      }
    },
    [roomId, socket]
  );

  const handleIncomingCall = useCallback(async (data: IncomingCall) => {
    console.log("Incoming call", data);
    if (data) {
      setIncomingCallData(data);
    }
  }, []);

  useEffect(() => {
    console.log("Remote user updated:", remoteUser);
  }, [remoteUser]);

  const handleAcceptIncomingCall = useCallback(async () => {
    if (!socket) return;
    console.log("Accepting incoming call", incomingCallData);
    if (!incomingCallData) return;
    const { from, user, offer, roomId } = incomingCallData;
    if (offer) {
      const answer = await peerService.getAnswer(offer);
      console.log("Answer", answer);
      if (answer) {
        setRemoteUser({ ...user, roomId, isConnected: true, joinedAt: new Date(), socketId: from });
        console.log("Setting remote socket id", remoteUser);
        socket.emit("peer:call:accepted", { to: from, offer: answer, roomId });
        setRemoteSocketId(from);
      }
    }
    setIncomingCallData(undefined);
  }, [incomingCallData, remoteUser, socket]);

  const handleCallAccepted = useCallback(
    async (data: any) => {
      if (!socket) return;
      console.log("Call accepted", data);
      const { offer, from, user, roomId } = data;

      await peerService.setRemoteDesc(offer);
      setRemoteUser({ ...user, roomId, isConnected: true, joinedAt: new Date(), socketId: from });
      setRemoteSocketId(from);
    },
    [socket]
  );

  const handleRejectIncomingCall = useCallback(() => {
    console.log("Rejecting incoming call");
    setIncomingCallData(undefined);
  }, []);

  const handleNegotiation = useCallback(async () => {
    if (!socket) return;
    console.log("Handle negotiation");
    const offer = await peerService.getOffer();
    socket.emit("peer:negotiate", { to: peerService.remoteSocketId, offer });
  }, [remoteSocketId, socket]);

  const handleRequiredPeerNegotiate = useCallback(
    async (data: any) => {
      if (!socket) return;
      console.log("Required peer negotiate", data);
      const { from, offer } = data;
      if (offer) {
        const answer = await peerService.getAnswer(offer);
        socket.emit("peer:negotiate:result", { to: from, offer: answer });
      }
    },
    [socket]
  );

  const handleRequiredPeerNegotiateFinalResult = useCallback(async (data: any) => {
    console.log("Required peer negotiate final result", data);
    const { from, offer } = data;
    if (offer) {
      await peerService.setRemoteDesc(offer);
    }
  }, []);

  const handleSetWhiteboardID = useCallback((payload: any) => {
    if (payload.whiteboardID) {
      setWhiteboardID(payload.whiteboardID);
    }
  }, []);

  const handleUserDisconnect = useCallback(
    (payload: any) => {
      const { socketId = null } = payload;
      if (socketId && remoteSocketId === socketId) {
        setRemoteUser(undefined);
      }
    },
    [remoteSocketId]
  );

  useEffect(() => {
    peerService.remoteSocketId = remoteSocketId;
  }, [remoteSocketId]);

  useEffect(() => {
    joinRoom();
  }, [currentUser, joinRoom]);

  useEffect(() => {
    handleRefreshUserList();
    peerService.init();
    peerService?.peer?.addEventListener("negotiationneeded", handleNegotiation);

    let temp = { filename: "", size: 0, checksum: undefined };
    let receivedSize = 0;
    let receiveBuffer: Buffer[] = [];

    if (peerService.peer) {
      peerService.peer.addEventListener("track", async (ev) => {
        const remoteStream = ev.streams[0];
        if (remoteStream) {
          setRemoteMediaStream((prev) => [...prev, remoteStream]);
        }
      });

      peerService.peer.ondatachannel = (e) => {
        peerService.remoteDataChanel = e.channel;
        peerService.remoteDataChanel.onmessage = async (e) => {
          const { data } = e;
          if (typeof data === "string") {
            const { name, size, checksum } = JSON.parse(data);
            temp = { filename: name, size, checksum };
            setAvailableFiles((prev) => [
              {
                name: temp.filename,
                size: temp.size,
                receivedSize: 0,
                checksum: temp.checksum,
                checksumMatched: false,
                timestamp: Date.now(),
              },
              ...prev,
            ]);
          } else {
            if (receivedSize < temp.size) {
              receiveBuffer.push(data);
              receivedSize += data.byteLength;
              setAvailableFiles((prev) =>
                prev.map((file) => (file.name === temp.filename ? { ...file, receivedSize } : file))
              );
            }
            if (receivedSize === temp.size) {
              const blob = new Blob(receiveBuffer);
              const arrayBuffer = await blob.arrayBuffer();
              const bufferString = JSON.stringify(arrayBuffer);
              const hash = createHmac("md5", secret).update(bufferString).digest("hex");

              setAvailableFiles((prev) =>
                prev.map((file) =>
                  file.name === temp.filename
                    ? { ...file, blob, checksumMatched: temp.checksum === hash, timestamp: Date.now() }
                    : file
                )
              );
              temp = { filename: "", size: 0, checksum: undefined };
              receivedSize = 0;
              receiveBuffer = [];
            }
          }
        };
        peerService.remoteDataChanel.onopen = () => console.log("Data Channel Created!");
      };
    }

    return () => {
      peerService?.peer?.removeEventListener("negotiationneeded", handleNegotiation);
    };
  }, [handleNegotiation, handleRefreshUserList, setAvailableFiles, setRemoteMediaStream]);

  useEffect(() => {
    if (!socket) return;

    const socketListeners = [
      { event: "refresh:user-list", handler: handleRefreshUserList },
      { event: "peer:incoming-call", handler: handleIncomingCall },
      { event: "peer:call:accepted", handler: handleCallAccepted },
      { event: "peer:negotiate", handler: handleRequiredPeerNegotiate },
      { event: "peer:negotiate:result", handler: handleRequiredPeerNegotiateFinalResult },
      { event: "whiteboard:id", handler: handleSetWhiteboardID },
    ];

    socketListeners.forEach(({ event, handler }) => {
      socket.on(event, handler);
    });

    return () => {
      socketListeners.forEach(({ event, handler }) => {
        socket.off(event, handler);
      });
    };
  }, [
    socket,
    handleRefreshUserList,
    handleIncomingCall,
    handleCallAccepted,
    handleRequiredPeerNegotiate,
    handleRequiredPeerNegotiateFinalResult,
    handleSetWhiteboardID,
  ]);

  return {
    users,
    whiteboardID,
    remoteUser,
    remoteSocketId,
    currentUser,
    roomId,
    incomingCallData,
    calledToUserId,
    handleRefreshUserList,
    handleClickUser,
    handleAcceptIncomingCall,
    handleRejectIncomingCall,
  };
}
