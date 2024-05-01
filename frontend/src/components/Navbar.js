"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const lucide_react_1 = require("lucide-react");
const client_1 = require("@auth0/nextjs-auth0/client");
const button_1 = require("./ui/button");
const navigation_1 = require("next/navigation");
const UserAvatar_1 = __importDefault(require("./UserAvatar"));
const Navbar = (props) => {
    const router = (0, navigation_1.useRouter)();
    const { remoteUser, remoteSocketId } = props;
    const { user } = (0, client_1.useUser)();
    const currentUser = user;
    return (<nav className="flex items-center justify-between">
      <header className="flex items-center text-xl align-middle font-sans font-bold antialiased">
        <lucide_react_1.AudioLines className="mr-2 inline"/>
        Connect <span className="text-sky-400/100"> Friends</span>
      </header>
      {currentUser && remoteSocketId && (<div>
          <div className="mx-5 mt-4 flex items-center text-white">
            <UserAvatar_1.default username={(currentUser === null || currentUser === void 0 ? void 0 : currentUser.name) || currentUser.email || "Someone"} src={(currentUser === null || currentUser === void 0 ? void 0 : currentUser.picture) || ""} height={40} width={40}/>
            <lucide_react_1.ArrowLeftRightIcon fontSize={20}/>
            {remoteUser ? (<UserAvatar_1.default username={(remoteUser === null || remoteUser === void 0 ? void 0 : remoteUser.name) || "Someone"} src={(remoteUser === null || remoteUser === void 0 ? void 0 : remoteUser.picture) || ""} height={40} width={40}/>) : (<p>Disconnected</p>)}
          </div>
        </div>)}
      {currentUser && (<>
          <div className="mx-6 mt-4 flex">
            <UserAvatar_1.default username={(currentUser === null || currentUser === void 0 ? void 0 : currentUser.name) || (currentUser === null || currentUser === void 0 ? void 0 : currentUser.email) || "Someone"} src={(currentUser === null || currentUser === void 0 ? void 0 : currentUser.picture) || ""} height={40} width={40}/>

            <button_1.Button className="ml-5" onClick={() => router.push("/api/auth/logout")}>
              LogOut
            </button_1.Button>
          </div>
        </>)}
    </nav>);
};
exports.default = Navbar;
