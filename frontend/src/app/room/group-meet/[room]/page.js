"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Navbar_1 = __importDefault(require("@/components/Navbar"));
const IncomingCallDialog_1 = __importDefault(require("@/components/IncomingCallDialog"));
const UsersList_1 = __importDefault(require("@/components/UsersList"));
const SetupAudioVideo_1 = __importDefault(require("@/components/SetupAudioVideo"));
const ShareButton_1 = require("@/components/ShareButton");
const MeetDashboard_1 = __importDefault(require("@/components/MeetDashboard"));
const useRoom_1 = require("@/app/hooks/useRoom");
function Room() {
    const { users, whiteboardID, remoteUser, remoteSocketId, incommingCallData, calledToUserId, currentUser, roomId, handleClickUser, handleAcceptIncommingCall, handleRejectIncommingCall, } = (0, useRoom_1.useRoom)();
    return (<div className="flex h-dvh flex-col justify-between  p-5">
      <Navbar_1.default remoteSocketId={remoteSocketId} remoteUser={remoteUser}/>

      {remoteSocketId && (<MeetDashboard_1.default remoteSocketId={remoteSocketId} whiteboardID={whiteboardID}/>)}

      {!remoteSocketId && (<>
          <UsersList_1.default users={users} roomId={roomId} currentUser={currentUser} calledToUserId={calledToUserId} handleClickUser={handleClickUser}/>
          <SetupAudioVideo_1.default />
          <div className="flex flex-col items-center justify-center mt-5 space-y-5">
            <ShareButton_1.ShareButton />
            <h6 className="font-sans text-slate-400">
              Tip: Click on user to make call
            </h6>
          </div>
        </>)}

      {incommingCallData && (<IncomingCallDialog_1.default incommingCallData={incommingCallData} handleAcceptIncommingCall={handleAcceptIncommingCall} handleRejectIncommingCall={handleRejectIncommingCall}/>)}
    </div>);
}
exports.default = Room;
