"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Icon_card_button_1 = __importDefault(require("@/components/Icon-card-button"));
const JoinRoomForm_1 = __importDefault(require("@/components/JoinRoomForm"));
const mode_toggle_1 = require("@/components/ui/mode-toggle");
function Home() {
    return (<main className="h-dvh overflow-auto p-5">
      <mode_toggle_1.ModeToggle />
      <div className="flex flex-col items-center text-center absolute sm:w-[90vw] sm:mx-5">
        <div className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 cursor-pointer animate-fadeIn`}>
          All in one Website for Meet
        </div>{" "}
        <div className="flex flex-col-reverse sm:flex-row">
          <section className="my-[7%] flex flex-wrap justify-center">
            <Icon_card_button_1.default />
          </section>
          <div className="w-1 border-r-4 bg-slate-100 sm:block hidden"></div>{" "}
          <section className="join-room">
            <JoinRoomForm_1.default />
          </section>
        </div>
      </div>
    </main>);
}
exports.default = Home;
