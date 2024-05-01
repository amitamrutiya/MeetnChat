"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const color_1 = require("@/utils/color");
const avatar_1 = require("@/components/ui/avatar");
const hover_card_1 = require("@/components/ui/hover-card");
const UserAvatar = (props) => {
    const { username, src, height, width } = props;
    if (!src)
        return (<>
        <avatar_1.Avatar style={{
                cursor: "pointer",
                marginLeft: 1,
                marginRight: 1,
                width: height !== null && height !== void 0 ? height : 90,
                height: width !== null && width !== void 0 ? width : 90,
                backgroundColor: (0, color_1.getRandomColorCode)(),
            }}>
          <avatar_1.AvatarImage src="https://github.com/shadcn.png"/>
          <avatar_1.AvatarFallback>CN</avatar_1.AvatarFallback>
        </avatar_1.Avatar>

        <p className="text-lg">{username[0]}</p>
      </>);
    return (<hover_card_1.HoverCard>
      <hover_card_1.HoverCardTrigger>
        <avatar_1.Avatar style={{
            cursor: "pointer",
            marginLeft: 1,
            marginRight: 1,
            width: height !== null && height !== void 0 ? height : 90,
            height: width !== null && width !== void 0 ? width : 90,
            backgroundColor: (0, color_1.getRandomColorCode)(),
        }}>
          <avatar_1.AvatarImage src={src}/>
          <avatar_1.AvatarFallback>{username[0]}</avatar_1.AvatarFallback>
        </avatar_1.Avatar>
      </hover_card_1.HoverCardTrigger>
      <hover_card_1.HoverCardContent>{username}</hover_card_1.HoverCardContent>
    </hover_card_1.HoverCard>);
};
exports.default = UserAvatar;
