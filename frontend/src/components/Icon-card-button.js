"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const functions_1 = __importDefault(require("@/app/data/functions"));
const hover_card_1 = require("@/components/ui/hover-card");
const client_1 = require("@auth0/nextjs-auth0/client");
const link_1 = __importDefault(require("next/link"));
const IconCardButton = () => {
    const { user } = (0, client_1.useUser)();
    return functions_1.default.map((f, i) => (<link_1.default key={i} href={user ? f.link : "/api/auth/login"} passHref>
      <hover_card_1.HoverCard>
        <hover_card_1.HoverCardTrigger>
          {" "}
          <div className="text-center mx-5 my-5 px-2 py-2 flex h-[250px] w-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-foreground shadow-md hover:bg-hover sm:my-0">
            <div className="text-center">
              <div className="flex justify-center pb-2">
                <span className="text-primary pr-4">
                  {react_1.default.createElement(f.icon1)}
                </span>
                <span className="text-primary">
                  {react_1.default.createElement(f.icon2)}
                </span>
              </div>
              <p className="font-sans text-lg font-bold text-primary">
                {f.title}
              </p>
              <p className="text-md font-sans font-bold">{f.subtitle}</p>
            </div>
          </div>
        </hover_card_1.HoverCardTrigger>
        <hover_card_1.HoverCardContent>{f.description}</hover_card_1.HoverCardContent>
      </hover_card_1.HoverCard>
    </link_1.default>));
};
exports.default = IconCardButton;
