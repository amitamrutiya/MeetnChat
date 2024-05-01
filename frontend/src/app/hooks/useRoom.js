"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRoom = void 0;
/* eslint-disable react-hooks/exhaustive-deps */
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const client_1 = require("@auth0/nextjs-auth0/client");
const SocketContext_1 = require("@/app/context/SocketContext");
const MediaStream_1 = require("@/app/context/MediaStream");
const FileTransfer_1 = require("@/app/context/FileTransfer");
const peer_1 = __importDefault(require("@/service/peer"));
const serverInstance_1 = require("@/app/api/serverInstance");
const crypto_1 = require("crypto");
function useRoom() {
    const currentUser = (0, client_1.useUser)().user;
    const socket = (0, react_1.useContext)(SocketContext_1.SocketContext);
    const { setRemoteMediaStream, remoteStreams } = (0, react_1.useContext)(MediaStream_1.MediaStreamContext);
    const { setAvailableFiles } = (0, react_1.useContext)(FileTransfer_1.FileTransferContext);
    const params = (0, navigation_1.useParams)();
    const roomId = params.room;
    const [calledToUserId, setCalledToUserId] = (0, react_1.useState)();
    const [incommingCallData, setIncommingCallData] = (0, react_1.useState)();
    const [remoteSocketId, setRemoteSocketId] = (0, react_1.useState)();
    const [remoteUser, setRemoteUser] = (0, react_1.useState)();
    const [users, setUsers] = (0, react_1.useState)([]);
    const [whiteboardID, setWhiteboardID] = (0, react_1.useState)(null);
    const secret = "$3#Ia";
    const joinRoom = (0, react_1.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
        console.log("Joining room");
        try {
            socket.emit("room:join", Object.assign({ roomId }, currentUser));
        }
        catch (error) {
            console.error("Error joining room", error);
        }
    }), [currentUser]);
    const handleRefreshUserList = (0, react_1.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
        console.log("Refreshing user list");
        try {
            const { data } = yield serverInstance_1.serverInstance.get("/users");
            if (data.users) {
                console.log(data.users);
                setUsers(data.users);
            }
        }
        catch (error) {
            console.error("Error refreshing user list", error);
        }
    }), []);
    const handleClickUser = (0, react_1.useCallback)((user) => __awaiter(this, void 0, void 0, function* () {
        console.log("Calling user", user);
        const offer = yield peer_1.default.getOffer();
        if (offer) {
            socket.emit("peer:call", {
                to: user.socketId,
                offer,
                roomId,
            });
        }
        setCalledToUserId(user.socketId);
    }), []);
    const handleIncommingCall = (0, react_1.useCallback)((data) => __awaiter(this, void 0, void 0, function* () {
        console.log("Incomming call", data);
        if (data) {
            setIncommingCallData(data);
        }
    }), []);
    const handleAcceptIncommingCall = (0, react_1.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
        console.log("Accepting incomming call", incommingCallData);
        if (!incommingCallData)
            return;
        const { from, user, offer, roomId } = incommingCallData;
        if (offer) {
            const answer = yield peer_1.default.getAnswer(offer);
            if (answer) {
                socket.emit("peer:call:accepted", { to: from, offer: answer, roomId });
                setRemoteUser(Object.assign(Object.assign({}, user), { roomId, isConnected: true, joinedAt: new Date(), socketId: from }));
                setRemoteSocketId(from);
            }
        }
        setIncommingCallData(undefined);
    }), [incommingCallData]);
    const handleCallAccepted = (0, react_1.useCallback)((data) => __awaiter(this, void 0, void 0, function* () {
        console.log("Call accepted", data);
        const { offer, from, user, roomId } = data;
        yield peer_1.default.setRemoteDesc(offer);
        setRemoteUser(Object.assign(Object.assign({}, user), { roomId, isConnected: true, joinedAt: new Date(), socketId: from }));
        setRemoteSocketId(from);
    }), []);
    const handleRejectIncommingCall = (0, react_1.useCallback)(() => {
        console.log("Rejecting incoming call");
        setIncommingCallData(undefined);
    }, []);
    const handleNegotiation = (0, react_1.useCallback)((ev) => __awaiter(this, void 0, void 0, function* () {
        console.log("Handle negotiation");
        const offer = yield peer_1.default.getOffer();
        socket.emit("peer:negotiate", { to: peer_1.default.remoteSocketId, offer });
    }), [remoteSocketId]);
    const handleRequiredPeerNegotiate = (0, react_1.useCallback)((data) => __awaiter(this, void 0, void 0, function* () {
        console.log("Required peer negotiate", data);
        const { from, offer } = data;
        if (offer) {
            const answer = yield peer_1.default.getAnswer(offer);
            socket.emit("peer:negosiate:result", { to: from, offer: answer });
        }
    }), []);
    const handleRequiredPeerNegotiateFinalResult = (0, react_1.useCallback)((data) => __awaiter(this, void 0, void 0, function* () {
        console.log("Required peer negotiate final result", data);
        const { from, offer } = data;
        if (offer) {
            yield peer_1.default.setRemoteDesc(offer);
        }
    }), []);
    const handleSetWhiteboardID = (0, react_1.useCallback)((payload) => {
        if (payload.whiteboardID) {
            setWhiteboardID(payload.whiteboardID);
        }
    }, []);
    const handleUserDisconnect = (0, react_1.useCallback)((payload) => {
        const { socketId = null } = payload;
        if (socketId && remoteSocketId === socketId) {
            setRemoteUser(undefined);
        }
    }, [remoteSocketId]);
    (0, react_1.useEffect)(() => {
        peer_1.default.remoteSocketId = remoteSocketId;
    }, [remoteSocketId]);
    (0, react_1.useEffect)(() => {
        joinRoom();
    }, [currentUser]);
    (0, react_1.useEffect)(() => {
        var _a;
        handleRefreshUserList();
        peer_1.default.init();
        (_a = peer_1.default === null || peer_1.default === void 0 ? void 0 : peer_1.default.peer) === null || _a === void 0 ? void 0 : _a.addEventListener("negotiationneeded", handleNegotiation);
        let temp = { filename: "", size: 0, checksum: null };
        let receivedSize = 0;
        let receiveBuffer = [];
        if (peer_1.default.peer) {
            peer_1.default.peer.addEventListener("track", (ev) => __awaiter(this, void 0, void 0, function* () {
                const remoteStream = ev.streams;
                if (remoteStream && setRemoteMediaStream) {
                    setRemoteMediaStream([...remoteStreams, remoteStream[0]]);
                }
            }));
            peer_1.default.peer.addEventListener("ended", () => __awaiter(this, void 0, void 0, function* () { }));
        }
        if (peer_1.default.peer)
            peer_1.default.peer.ondatachannel = (e) => {
                peer_1.default.remoteDataChanel = e.channel;
                peer_1.default.remoteDataChanel.onmessage = (e) => {
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
                    }
                    else {
                        try {
                            if (data && receivedSize < temp.size) {
                                receiveBuffer.push(data);
                                receivedSize += data.byteLength;
                                setAvailableFiles((e) => e.map((e) => e.name === temp.filename
                                    ? {
                                        name: temp.filename,
                                        size: temp.size,
                                        recievedSize: receivedSize,
                                        checksum: temp.checksum,
                                        checksumMatched: false,
                                        timestamp: Date.now(),
                                    }
                                    : e));
                            }
                            if (data && receivedSize === temp.size) {
                                const blob = new Blob(receiveBuffer);
                                (() => __awaiter(this, void 0, void 0, function* () {
                                    const arraybuffer = yield blob.arrayBuffer();
                                    const bufferString = JSON.stringify(arraybuffer);
                                    const hash = (0, crypto_1.createHmac)("md5", secret)
                                        .update(bufferString)
                                        .digest("hex");
                                    if (temp.checksum !== hash) {
                                        setAvailableFiles((e) => e.map((e) => e.name === temp.filename
                                            ? {
                                                name: temp.filename,
                                                size: temp.size,
                                                recievedSize: receivedSize,
                                                blob,
                                                checksumMatched: false,
                                                checksum: temp.checksum,
                                                timestamp: Date.now(),
                                            }
                                            : e));
                                    }
                                    else {
                                        setAvailableFiles((e) => e.map((e) => e.name === temp.filename
                                            ? {
                                                name: temp.filename,
                                                size: temp.size,
                                                recievedSize: receivedSize,
                                                blob,
                                                checksum: temp.checksum,
                                                checksumMatched: true,
                                                timestamp: Date.now(),
                                            }
                                            : e));
                                        temp = {
                                            filename: "",
                                            size: 0,
                                            checksum: null,
                                        };
                                        receivedSize = 0;
                                        receiveBuffer = [];
                                    }
                                }))();
                            }
                        }
                        catch (error) { }
                    }
                };
                peer_1.default.remoteDataChanel.onopen = (e) => console.log("Data Chanel Created!");
            };
        return () => {
            var _a;
            (_a = peer_1.default === null || peer_1.default === void 0 ? void 0 : peer_1.default.peer) === null || _a === void 0 ? void 0 : _a.removeEventListener("negotiationneeded", handleNegotiation);
        };
    }, [remoteStreams]);
    (0, react_1.useEffect)(() => {
        if (remoteSocketId) {
            socket.off("refresh:user-list", handleRefreshUserList);
            socket.on("user-disconnected", handleUserDisconnect);
        }
        return () => {
            socket.on("refresh:user-list", handleRefreshUserList);
            socket.off("user-disconnected", handleUserDisconnect);
        };
    }, [remoteSocketId]);
    (0, react_1.useEffect)(() => {
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
exports.useRoom = useRoom;
