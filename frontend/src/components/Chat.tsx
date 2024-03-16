import React from "react";
import moment from "moment";
import { BsFillChatLeftFill } from "react-icons/bs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Socket } from "socket.io-client";
import { SocketContext } from "@/app/context/SocketContext";
import { Badge } from "./ui/badge";

interface Message {
  from?: string;
  displayPicture?: string;
  message: string;
  timestamp?: Date | number;
  isSelf?: boolean;
}
interface MessageProps extends Message {}

interface ChatProps {
  remoteSocketId?: string;
}

const Message: React.FC<MessageProps> = (props) => {
  const { from, message, isSelf, displayPicture, timestamp } = props;

  const convertedTime = React.useMemo(
    () => (timestamp ? moment(new Date(timestamp), "MM").fromNow() : undefined),
    [timestamp]
  );

  return (
    <div>
      <div className="flex items-center pb-0">
        {!isSelf && (
          <div className="mr-3">
            <Avatar className="bg-slate-500 shadow-xl">
              <AvatarImage src={displayPicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        )}
        <div
          className={`rounded-2xl ${
            isSelf ? "rounded-tr-none" : "rounded-tl-none"
          } ${
            isSelf ? "bg-slate-700" : "bg-sky-600"
          } p-2 text-white shadow-xl flex-grow`}
        >
          {message}
        </div>
        {isSelf && (
          <div className="ml-3">
            <Avatar className="bg-slate-500 shadow-xl">
              <AvatarImage src={displayPicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>

      <small
        className={`${
          isSelf ? "pl-[16px]" : "float-right pr-[16px]"
        } text-slate-400`}
      >
        {convertedTime && convertedTime}
      </small>
    </div>
  );
};

const Chat: React.FC<ChatProps> = (props) => {
  const { remoteSocketId } = props;
  const [opened, setOpened] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);

  const [inputChatMessage, setInputChatMessage] = React.useState<
    string | undefined
  >();

  const [unreadMessageCount, setUnreadMessageCount] = React.useState(0);

  const socket = React.useContext(SocketContext) as Socket;
  const chatBoxContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (chatBoxContainerRef.current) {
      chatBoxContainerRef.current.scrollTo(
        0,
        chatBoxContainerRef.current.scrollHeight
      );
    }
  }, [messages]);

  React.useEffect(() => {
    if (opened) {
      setUnreadMessageCount(0);
    } else {
      setUnreadMessageCount((e) => e + 1);
    }
  }, [opened, messages]);

  const toggleChatBox = React.useCallback(() => setOpened((e) => !e), []);

  const handleOnMessage = React.useCallback((data: any) => {
    const { from, message, user, self = false } = data;
    setMessages((e) => [
      ...e,
      {
        from: user.username,
        displayPicture: user.displayPicture,
        message: message.message,
        isSelf: self,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  const handleChatInboxKeyPress = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter") {
        if (inputChatMessage && inputChatMessage.trim() !== "") {
          const message: Message = { message: inputChatMessage };
          socket.emit("chat:message", { to: remoteSocketId, message });
          setInputChatMessage("");
        }
      }
    },
    [socket, inputChatMessage]
  );

  React.useEffect(() => {
    socket.on("chat:message", handleOnMessage);

    return () => {
      socket.off("chat:message", handleOnMessage);
    };
  }, [handleOnMessage]);

  return (
    <div className="relative">
      {opened && (
        <>
          <div
            ref={chatBoxContainerRef}
            className="my-2 ml-auto h-[400px] w-[350px] overflow-y-scroll rounded-md bg-slate-800 py-2 text-black shadow-2xl"
          >
            {messages && messages.length > 0 && (
              <div className="flex-grow max-w-[752px]">
                <div className="grid grid-cols-1 gap-2">
                  <div className="col-span-1">
                    <ul className="list-none">
                      {messages &&
                        messages.length > 0 &&
                        messages.map((e) => (
                          <li key={e.from}>
                            <Message {...e} />
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {messages && messages.length <= 0 && (
              <div className="flex h-full w-full items-center justify-center font-sans text-slate-400">
                <p>No new messages</p>
              </div>
            )}
          </div>
          <div
            onKeyDown={handleChatInboxKeyPress}
            className="my-2 ml-auto w-[350px] rounded-md bg-[#18181b] p-3 text-slate-600"
          >
            <input
              type="text"
              onChange={(e: any) => setInputChatMessage(e.target.value)}
              className="w-full rounded-lg bg-white border-2 border-gray-300 p-2"
              id="standard-basic"
              placeholder="Type your message here..."
              autoComplete="off"
              value={inputChatMessage}
            />
          </div>
        </>
      )}
      <div className="flex h-full w-full items-center justify-end">
        <button
          onClick={toggleChatBox}
          className="bg-sky-500 text-white rounded-full p-2 inline-flex items-center justify-center"
        >
          <Badge color="warning">
            {unreadMessageCount > 1 ? unreadMessageCount - 1 : undefined}
            <BsFillChatLeftFill fill="#fff" color="#fff" fontSize={20} />
          </Badge>
        </button>
      </div>
    </div>
  );
};

export default Chat;
