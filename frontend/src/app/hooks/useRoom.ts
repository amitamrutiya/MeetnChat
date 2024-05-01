/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { SocketContext } from "@/app/context/SocketContext";
import { MediaStreamContext, ProviderProps } from "@/app/context/MediaStream";
import {
  FileTransferContext,
  FileTransferProps,
} from "@/app/context/FileTransfer";
import peerService from "@/service/peer";
import { serverInstance } from "@/app/api/serverInstance";
import { Socket } from "socket.io-client";
import { IncomingCall, User } from "@/type";
import { createHmac } from "crypto";

export function useRoom() {
  const currentUser = useUser().user;
  const socket = useContext(SocketContext) as Socket;
  const { setRemoteMediaStream, remoteStreams } = useContext(
    MediaStreamContext
  ) as ProviderProps;
  const { setAvailableFiles } = useContext(
    FileTransferContext
  ) as FileTransferProps;
  const params = useParams();
  const roomId = params.room;

  const [calledToUserId, setCalledToUserId] = useState<string | undefined>();
  const [incommingCallData, setIncommingCallData] = useState<
    IncomingCall | undefined
  >();
  const [remoteSocketId, setRemoteSocketId] = useState<string | undefined>();
  const [remoteUser, setRemoteUser] = useState<undefined | User>();
  const [users, setUsers] = useState<User[]>([]);
  const [whiteboardID, setWhiteboardID] = useState<string | null>(null);
  const secret = "$3#Ia";

  const joinRoom = useCallback(async () => {
    if (!currentUser || !roomId) return;
    if (process.env.ENVIRONMENT !== "development") {
      if (users.map((e) => e.email).includes(currentUser.email)) return;
    }
    console.log("Joining room");
    try {
      socket.emit("room:join", {
        roomId,
        ...currentUser,
      });
    } catch (error) {
      console.error("Error joining room", error);
    }
  }, [currentUser]);

  const handleRefreshUserList = useCallback(async () => {
    console.log("Refreshing user list");
    try {
      const { data } = await serverInstance.get("/users");
      if (data.users) {
        console.log(data.users);
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error refreshing user list", error);
    }
  }, []);

  const handleClickUser = useCallback(async (user: User) => {
    console.log("Calling user", user);
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

  const handleIncommingCall = useCallback(async (data: IncomingCall) => {
    console.log("Incomming call", data);
    if (data) {
      setIncommingCallData(data);
    }
  }, []);

  const handleAcceptIncommingCall = useCallback(async () => {
    console.log("Accepting incomming call", incommingCallData);
    if (!incommingCallData) return;
    const { from, user, offer, roomId } = incommingCallData;
    if (offer) {
      const answer = await peerService.getAnswer(offer);
      if (answer) {
        socket.emit("peer:call:accepted", { to: from, offer: answer, roomId });
        setRemoteUser({
          ...user,
          roomId,
          isConnected: true,
          joinedAt: new Date(),
          socketId: from,
        });
        setRemoteSocketId(from);
      }
    }
    setIncommingCallData(undefined);
  }, [incommingCallData]);

  const handleCallAccepted = useCallback(async (data: any) => {
    console.log("Call accepted", data);
    const { offer, from, user, roomId } = data;

    await peerService.setRemoteDesc(offer);
    setRemoteUser({
      ...user,
      roomId,
      isConnected: true,
      joinedAt: new Date(),
      socketId: from,
    });
    setRemoteSocketId(from);
  }, []);

  const handleRejectIncommingCall = useCallback(() => {
    console.log("Rejecting incoming call");
    setIncommingCallData(undefined);
  }, []);

  const handleNegotiation = useCallback(
    async (ev: Event) => {
      console.log("Handle negotiation");
      const offer = await peerService.getOffer();
      socket.emit("peer:negotiate", { to: peerService.remoteSocketId, offer });
    },
    [remoteSocketId]
  );

  const handleRequiredPeerNegotiate = useCallback(async (data: any) => {
    console.log("Required peer negotiate", data);
    const { from, offer } = data;
    if (offer) {
      const answer = await peerService.getAnswer(offer);
      socket.emit("peer:negosiate:result", { to: from, offer: answer });
    }
  }, []);

  const handleRequiredPeerNegotiateFinalResult = useCallback(
    async (data: any) => {
      console.log("Required peer negotiate final result", data);
      const { from, offer } = data;
      if (offer) {
        await peerService.setRemoteDesc(offer);
      }
    },
    []
  );

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
  }, [currentUser]);

  useEffect(() => {
    handleRefreshUserList();
    peerService.init();

    peerService?.peer?.addEventListener("negotiationneeded", handleNegotiation);

    let temp = { filename: "", size: 0, checksum: null };
    let receivedSize = 0;
    let receiveBuffer: Buffer[] = [];

    if (peerService.peer) {
      peerService.peer.addEventListener("track", async (ev) => {
        const remoteStream = ev.streams;
        if (remoteStream && setRemoteMediaStream) {
          setRemoteMediaStream([...remoteStreams, remoteStream[0]]);
        }
      });
      peerService.peer.addEventListener("ended", async () => {});
    }

    if (peerService.peer)
      peerService.peer.ondatachannel = (e) => {
        peerService.remoteDataChanel = e.channel;
        peerService.remoteDataChanel.onmessage = (e) => {
          const { data } = e;

          if (typeof data === "string") {
            const { name, size, checksum } = JSON.parse(data);
            temp.filename = name;
            temp.size = size;
            temp.checksum = checksum;

            setAvailableFiles((e) => [
              {
                name: temp.filename,
                size: temp.size,
                recievedSize: 0,
                checksum: temp.checksum,
                checksumMatched: false,
                timestamp: Date.now(),
              },
              ...e,
            ]);
          } else {
            try {
              if (data && receivedSize < temp.size) {
                receiveBuffer.push(data);
                receivedSize += data.byteLength;
                setAvailableFiles((e) =>
                  e.map((e) =>
                    e.name === temp.filename
                      ? {
                          name: temp.filename,
                          size: temp.size,
                          recievedSize: receivedSize,
                          checksum: temp.checksum,
                          checksumMatched: false,
                          timestamp: Date.now(),
                        }
                      : e
                  )
                );
              }
              if (data && receivedSize === temp.size) {
                const blob = new Blob(receiveBuffer);

                (async () => {
                  const arraybuffer = await blob.arrayBuffer();
                  const bufferString = JSON.stringify(arraybuffer);
                  const hash = createHmac("md5", secret)
                    .update(bufferString)
                    .digest("hex");

                  if (temp.checksum !== hash) {
                    setAvailableFiles((e) =>
                      e.map((e) =>
                        e.name === temp.filename
                          ? {
                              name: temp.filename,
                              size: temp.size,
                              recievedSize: receivedSize,
                              blob,
                              checksumMatched: false,
                              checksum: temp.checksum,
                              timestamp: Date.now(),
                            }
                          : e
                      )
                    );
                  } else {
                    setAvailableFiles((e) =>
                      e.map((e) =>
                        e.name === temp.filename
                          ? {
                              name: temp.filename,
                              size: temp.size,
                              recievedSize: receivedSize,
                              blob,
                              checksum: temp.checksum,
                              checksumMatched: true,
                              timestamp: Date.now(),
                            }
                          : e
                      )
                    );
                    temp = {
                      filename: "",
                      size: 0,
                      checksum: null,
                    };
                    receivedSize = 0;
                    receiveBuffer = [];
                  }
                })();
              }
            } catch (error) {}
          }
        };
        peerService.remoteDataChanel.onopen = (e) =>
          console.log("Data Chanel Created!");
      };

    return () => {
      peerService?.peer?.removeEventListener(
        "negotiationneeded",
        handleNegotiation
      );
    };
  }, [remoteStreams]);

  useEffect(() => {
    if (remoteSocketId) {
      socket.off("refresh:user-list", handleRefreshUserList);
      socket.on("user-disconnected", handleUserDisconnect);
    }

    return () => {
      socket.on("refresh:user-list", handleRefreshUserList);
      socket.off("user-disconnected", handleUserDisconnect);
    };
  }, [remoteSocketId]);

  useEffect(() => {
    const socketListeners = [
      { event: "refresh:user-list", handler: handleRefreshUserList },
      { event: "peer:incomming-call", handler: handleIncommingCall },
      { event: "peer:call:accepted", handler: handleCallAccepted },
      { event: "peer:negotiate", handler: handleRequiredPeerNegotiate },
      {
        event: "peer:negosiate:result",
        handler: handleRequiredPeerNegotiateFinalResult,
      },
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
  }, []);

  return {
    users,
    whiteboardID,
    remoteUser,
    remoteSocketId,
    currentUser,
    roomId,
    incommingCallData,
    calledToUserId,
    handleRefreshUserList,
    handleClickUser,
    handleAcceptIncommingCall,
    handleRejectIncommingCall,
  };
}
