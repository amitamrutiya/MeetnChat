"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const avatar_1 = require("./ui/avatar");
function UsersList(props) {
    const { users, roomId, currentUser, calledToUserId, handleClickUser } = props;
    return (<div className="flex w-full items-center justify-center text-white">
      {users &&
            users
                .filter((e) => e.name !== `${currentUser === null || currentUser === void 0 ? void 0 : currentUser.name} - ${currentUser === null || currentUser === void 0 ? void 0 : currentUser.email}`)
                .filter((e) => {
                return e.roomId === roomId;
            })
                .map((user, index) => {
                var _a;
                return (<div key={`${user.name}-${index}`} onClick={() => handleClickUser(user)} className={calledToUserId && calledToUserId === user.socketId
                        ? `border-collapse rounded-3xl border-0 border-dashed border-sky-400 motion-safe:animate-bounce`
                        : ""}>
              <avatar_1.Avatar>
                <avatar_1.AvatarImage src={(_a = user.picture) !== null && _a !== void 0 ? _a : ""}/>
                <avatar_1.AvatarFallback>{user.name}</avatar_1.AvatarFallback>
              </avatar_1.Avatar>
            </div>);
            })}
      {(!users ||
            users.filter((e) => e.name !== `${currentUser === null || currentUser === void 0 ? void 0 : currentUser.name} - ${currentUser === null || currentUser === void 0 ? void 0 : currentUser.email}`).length <= 0) && (<h2 className="font-sans text-slate-400 opacity-70 motion-safe:animate-bounce">
          Join by opening this on other tab
        </h2>)}
    </div>);
}
exports.default = UsersList;
