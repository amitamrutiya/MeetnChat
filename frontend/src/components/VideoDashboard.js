"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_player_1 = __importDefault(require("react-player"));
const avatar_1 = require("./ui/avatar");
const client_1 = require("@auth0/nextjs-auth0/client");
const MediaStream_1 = require("@/app/context/MediaStream");
const AudioVideoButton_1 = __importDefault(require("./AudioVideoButton"));
const ChatButton_1 = __importDefault(require("./ChatButton"));
const SettingButton_1 = __importDefault(require("./SettingButton"));
const EndMeetButton_1 = __importDefault(require("./EndMeetButton"));
const Dashboard = (props) => {
    var _a, _b, _c, _d;
    const { remoteSocketId, remoteUser } = props;
    const { user } = (0, client_1.useUser)();
    const { userStream, remoteStreams } = react_1.default.useContext(MediaStream_1.MediaStreamContext);
    return (<div className="flex flex-col mx-[20%]">
      <div className="mb-10 h-[74vh] overflow-auto">
        <div className="h-full w-full rounded-md bg-transparent flex justify-center items-center ">
          <div className=" bg-foreground h-[55%] w-[50%] flex justify-center items-center border-8 border-blue-500 rounded-xl shadow-lg p-4">
            {userStream ? (<>
                (
                <div className="group relative flex justify-center">
                  <react_player_1.default url={userStream} muted={false} playing controls={false} style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
            }}/>
                  <span className="absolute top-[80%] left-0 right-0 hidden group-hover:block">
                    {"You"}
                  </span>
                </div>
                )
              </>) : (<avatar_1.Avatar className="h-36 w-36">
                <avatar_1.AvatarImage src={(_b = (_a = user === null || user === void 0 ? void 0 : user.picture) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "/user.png"} alt="User"/>
                <avatar_1.AvatarFallback>CN</avatar_1.AvatarFallback>
              </avatar_1.Avatar>)}
          </div>
          <div className="my-3 px-3"/>
          <div className="bg-foreground h-[55%] w-[50%] flex justify-center items-center border-8 border-blue-500 rounded-xl shadow-lg p-4">
            {remoteStreams.length > 0 ? (<div>
                {remoteStreams.map((stream) => (<>
                    <div className="my-5"/>
                    <div className="group relative">
                      <react_player_1.default key={stream.id} width="100%" height="100%" url={stream} muted={false} playing controls={false} pip className="opacity-100 group-hover:opacity-50"/>
                    </div>
                  </>))}
              </div>) : (<avatar_1.Avatar className="h-36 w-36">
                <avatar_1.AvatarImage src={(_d = (_c = remoteUser === null || remoteUser === void 0 ? void 0 : remoteUser.picture) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "/user.png"} alt="User"/>
                <avatar_1.AvatarFallback>CN</avatar_1.AvatarFallback>
              </avatar_1.Avatar>)}
          </div>
        </div>{" "}
      </div>
      <div className="flex flex-row">
        <div className="sm:w-auto rounded-lg bg-slate-600 px-3 mx-auto py-2">
          <div className="flex flex-row h-full w-full items-center justify-center gap-4">
            <AudioVideoButton_1.default />
            <ChatButton_1.default remoteSocketId={remoteSocketId}/>
            <SettingButton_1.default />
            <EndMeetButton_1.default />
          </div>
        </div>
      </div>{" "}
    </div>);
};
exports.default = Dashboard;
