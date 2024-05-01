"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const avatar_1 = require("@/components/ui/avatar");
const moment_1 = __importDefault(require("moment"));
function MessageDiv(props) {
    const { from, message, isSelf, displayPicture, timestamp } = props;
    const convertedTime = react_1.default.useMemo(() => (timestamp ? (0, moment_1.default)(new Date(timestamp), "MM").fromNow() : undefined), [timestamp]);
    return (<div className="mb-2">
      <div className="flex items-center w-full pb-0">
        {!isSelf && (<div className="mr-3">
            <avatar_1.Avatar className="bg-slate-500 shadow-xl">
              <avatar_1.AvatarImage src={displayPicture}/>
              <avatar_1.AvatarFallback>Other</avatar_1.AvatarFallback>
            </avatar_1.Avatar>
          </div>)}
        <div className={`rounded-2xl ${isSelf ? "rounded-tr-none" : "rounded-tl-none"} ${isSelf ? "bg-slate-700" : "bg-sky-600"} p-2 text-white shadow-xl flex-grow`}>
          {message}
        </div>
        {isSelf && (<div className="ml-3">
            <avatar_1.Avatar className="bg-slate-500 shadow-xl">
              <avatar_1.AvatarImage src={displayPicture}/>
              <avatar_1.AvatarFallback>You</avatar_1.AvatarFallback>
            </avatar_1.Avatar>
          </div>)}
      </div>

      <small className={`${isSelf ? "pl-[16px]" : "float-right pr-[16px]"} text-slate-400 mb-2`}>
        {convertedTime && convertedTime}
      </small>
    </div>);
}
exports.default = MessageDiv;
