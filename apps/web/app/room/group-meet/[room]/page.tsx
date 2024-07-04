"use client";

import IncomingCallDialog from "../../../../components/incoming-call-dialogue";
import RoomNavbar from "../../../../components/room-navbar";
import SetupAudioVideo from "../../../../components/setup-audio-video";
import { ShareButton } from "../../../../components/share-button";
import UsersList from "../../../../components/user-list";
import Dashboard from "../../../../components/video-dashboard";
import { useRoom } from "../../../../hooks/use-room";

export default function Room() {
  const {
    users,
    whiteboardID,
    remoteUser,
    remoteSocketId,
    incommingCallData,
    calledToUserId,
    currentUser,
    roomId,
    handleClickUser,
    handleAcceptIncommingCall,
    handleRejectIncommingCall,
  } = useRoom();

  return (
    <div className="flex h-dvh flex-col justify-between  p-5">
      <RoomNavbar remoteSocketId={remoteSocketId} remoteUser={remoteUser} />

      {remoteSocketId && (
        <Dashboard
          remoteSocketId={remoteSocketId}
          whiteboardID={whiteboardID}
        />
      )}

      {!remoteSocketId && (
        <>
          <UsersList
            users={users}
            roomId={roomId}
            currentUser={currentUser}
            calledToUserId={calledToUserId}
            handleClickUser={handleClickUser}
          />
          <SetupAudioVideo />
          <div className="flex flex-col items-center justify-center mt-5 space-y-5">
            <ShareButton />
            <h6 className="font-sans text-slate-400">
              Tip: Click on user to make call
            </h6>
          </div>
        </>
      )}

      {incommingCallData && (
        <IncomingCallDialog
          incommingCallData={incommingCallData}
          handleAcceptIncommingCall={handleAcceptIncommingCall}
          handleRejectIncommingCall={handleRejectIncommingCall}
        />
      )}
    </div>
  );
}
