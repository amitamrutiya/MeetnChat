"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_player_1 = __importDefault(require("react-player"));
const MediaStream_1 = require("@/app/context/MediaStream");
const button_1 = require("./ui/button");
const avatar_1 = require("./ui/avatar");
const client_1 = require("@auth0/nextjs-auth0/client");
const AudioVideoBar = (props) => {
    var _a, _b, _c, _d;
    const { pinVideoObj, pinVideo, unPinVideo, remoteUser } = props;
    const { userStream, remoteStreams } = react_1.default.useContext(MediaStream_1.MediaStreamContext);
    const { user } = (0, client_1.useUser)();
    return (<div className="h-full w-full rounded-md bg-transparent flex flex-col items-center ">
      <div className=" bg-foreground h-[45%] w-[69%] flex justify-center items-center border-8 border-blue-500 rounded-xl shadow-lg p-4">
        {userStream ? (<>
            {(pinVideoObj === null || pinVideoObj === void 0 ? void 0 : pinVideoObj.id) !== userStream.id && (<div className="group relative flex justify-center">
                <react_player_1.default url={userStream} muted={false} playing controls={false} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                {pinVideoObj && pinVideoObj.id == userStream.id ? (<button className="absolute top-[50%] left-0 right-0 hidden group-hover:block" onClick={unPinVideo}>
                    <button_1.Button className="m-auto" title="UnPin video"/>
                  </button>) : (<button className="absolute top-[50%] left-0 right-0 hidden group-hover:block" onClick={() => pinVideo(userStream.id)}>
                    <button_1.Button className="m-auto" title="Pin video"/>
                  </button>)}
                <span className="absolute top-[80%] left-0 right-0 hidden group-hover:block">
                  {"You"}
                </span>
              </div>)}
          </>) : (<avatar_1.Avatar className="h-36 w-36">
            <avatar_1.AvatarImage src={(_b = (_a = user === null || user === void 0 ? void 0 : user.picture) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "/user.png"} alt="User"/>
            <avatar_1.AvatarFallback>CN</avatar_1.AvatarFallback>
          </avatar_1.Avatar>)}
      </div>
      <div className="my-3"/>
      <div className="bg-foreground h-[45%] w-[69%] flex justify-center items-center border-8 border-blue-500 rounded-xl shadow-lg p-4">
        {remoteStreams.length > 0 ? (<div>
            {remoteStreams
                .filter((stream) => stream.id !== (pinVideoObj === null || pinVideoObj === void 0 ? void 0 : pinVideoObj.id))
                .map((stream) => (<>
                  <div className="my-5"/>
                  <div className="group relative">
                    <react_player_1.default key={stream.id} width="100%" height="100%" url={stream} muted={false} playing controls={false} pip className="opacity-100 group-hover:opacity-50"/>
                    {pinVideoObj && pinVideoObj.id == stream.id ? (<button className="absolute top-[50%] left-0 right-0 hidden group-hover:block" onClick={unPinVideo}>
                        <button_1.Button className="m-auto" title="UnPin video"/>
                      </button>) : (<button className="absolute top-[50%] left-0 right-0 hidden group-hover:block" onClick={() => pinVideo(stream.id)}>
                        <button_1.Button className="m-auto" title="Pin video"/>
                      </button>)}
                  </div>
                </>))}
          </div>) : (<avatar_1.Avatar className="h-36 w-36">
            <avatar_1.AvatarImage src={(_d = (_c = remoteUser === null || remoteUser === void 0 ? void 0 : remoteUser.picture) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "/user.png"} alt="User"/>
            <avatar_1.AvatarFallback>CN</avatar_1.AvatarFallback>
          </avatar_1.Avatar>)}
      </div>
    </div>);
};
exports.default = AudioVideoBar;
