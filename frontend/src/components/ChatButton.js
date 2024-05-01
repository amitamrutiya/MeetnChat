"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lucide_react_1 = require("lucide-react");
const textarea_1 = require("@/components/ui/textarea");
const tooltip_1 = require("@/components/ui/tooltip");
const button_1 = require("./ui/button");
const sheet_1 = require("@/components/ui/sheet");
const SocketContext_1 = require("@/app/context/SocketContext");
const react_1 = require("react");
const MessageDiv_1 = __importDefault(require("./MessageDiv"));
const FileTransfer_1 = __importDefault(require("./FileTransfer"));
const FileCard_1 = __importDefault(require("./FileCard"));
const FileTransfer_2 = require("@/app/context/FileTransfer");
function ChatButton(props) {
    const { remoteSocketId } = props;
    const [isChatOpen, setIsChatOpen] = (0, react_1.useState)(false);
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [inputChatMessage, setInputChatMessage] = (0, react_1.useState)();
    const { availableFiles } = (0, react_1.useContext)(FileTransfer_2.FileTransferContext);
    const socket = (0, react_1.useContext)(SocketContext_1.SocketContext);
    const chatBoxContainerRef = (0, react_1.useRef)(null);
    const combined = [...availableFiles, ...messages].sort((a, b) => a.timestamp - b.timestamp);
    (0, react_1.useEffect)(() => {
        if (chatBoxContainerRef.current) {
            chatBoxContainerRef.current.scrollTo(0, chatBoxContainerRef.current.scrollHeight);
        }
    }, [messages, isChatOpen]);
    const handleOnMessage = (0, react_1.useCallback)((data) => {
        const { from, message, user, self = false } = data;
        setMessages((e) => [
            ...e,
            {
                from: user.name,
                displayPicture: user.picture,
                message: message,
                isSelf: self,
                timestamp: Date.now(),
            },
        ]);
    }, []);
    const submitMessage = () => {
        if (inputChatMessage && inputChatMessage.length > 0) {
            socket.emit("chat:message", {
                to: remoteSocketId,
                message: inputChatMessage,
            });
            setInputChatMessage("");
        }
    };
    (0, react_1.useEffect)(() => {
        socket.on("chat:message", handleOnMessage);
        return () => {
            socket.off("chat:message", handleOnMessage);
        };
    }, [handleOnMessage]);
    return (<tooltip_1.TooltipProvider>
      <tooltip_1.Tooltip>
        <tooltip_1.TooltipTrigger>
          <sheet_1.Sheet>
            <sheet_1.SheetTrigger>
              <button_1.Button size={"icon"} className="bg-foreground" onClick={() => {
            setIsChatOpen(!isChatOpen);
        }}>
                <lucide_react_1.MessageCircleMoreIcon />
              </button_1.Button>
            </sheet_1.SheetTrigger>
            <sheet_1.SheetContent className="flex flex-col justify-between">
              <sheet_1.SheetHeader>
                <sheet_1.SheetTitle>Chat</sheet_1.SheetTitle>
                <sheet_1.SheetDescription>Start a conversation</sheet_1.SheetDescription>
              </sheet_1.SheetHeader>
              <div ref={chatBoxContainerRef} className="w-full h-full rounded-md border overflow-y-auto p-2">
                <div className="flex-grow max-w-[752px]">
                  <div className="grid grid-cols-1 gap-2">
                    <div className="col-span-1">
                      <ul className="list-none">
                        {combined.map((item, index) => {
            if ("message" in item) {
                return (<li key={item.from}>
                                <MessageDiv_1.default {...item}/>
                              </li>);
            }
            else {
                return (<FileCard_1.default key={`${item.name}-${index}`} file={item}/>);
            }
        })}
                      </ul>
                    </div>
                  </div>
                </div>
                {messages && messages.length <= 0 && (<div className="flex h-full w-full items-center justify-center font-sans">
                    <p>No new messages</p>
                  </div>)}
              </div>
              <sheet_1.SheetFooter>
                <div className="grid w-full gap-2">
                  <textarea_1.Textarea value={inputChatMessage} onChange={(e) => setInputChatMessage(e.target.value)} placeholder="Type your message here." typeof="text"/>
                  <div className="flex gap-2">
                    <button_1.Button className="w-full" onClick={submitMessage}>
                      Send message
                      <lucide_react_1.SendHorizonalIcon />
                    </button_1.Button>
                    <FileTransfer_1.default />
                  </div>
                </div>
              </sheet_1.SheetFooter>
            </sheet_1.SheetContent>
          </sheet_1.Sheet>
        </tooltip_1.TooltipTrigger>
        <tooltip_1.TooltipContent>
          <p>Chat</p>
        </tooltip_1.TooltipContent>
      </tooltip_1.Tooltip>
    </tooltip_1.TooltipProvider>);
}
exports.default = ChatButton;
