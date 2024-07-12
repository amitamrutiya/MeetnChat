"use client";

import EndCallNotificationDialogue from "components/end-call-notification-dialogue";
import endCallNotificationDialogue from "components/end-call-notification-dialogue";
import IncomingCallDialog from "components/incoming-call-dialogue";
import RoomNavbar from "components/room-navbar";
import SetupAudioVideo from "components/setup-audio-video";
import { ShareButton } from "components/share-button";
import UsersList from "components/user-list";
import VideoDashboard from "components/video-dashboard";
import { useRoom } from "hooks/use-room";

export default function Room() {
  const {
    users,
    whiteboardID,
    remoteUser,
    remoteSocketId,
    calledToUserId,
    currentUser,
    incomingCallData,
    roomId,
    handleClickUser,
    handleAcceptIncomingCall,
    isDisconnect,
    handleRejectIncomingCall,
  } = useRoom();

  return (
    <div className="flex h-dvh flex-col justify-between p-5">
      <RoomNavbar remoteSocketId={remoteSocketId} remoteUser={remoteUser} />

      {remoteSocketId && (
        <VideoDashboard remoteSocketId={remoteSocketId} whiteboardID={whiteboardID} remoteUser={remoteUser} />
      )}

      {!remoteSocketId && (
        <>
          <UsersList
            users={users}
            roomId={roomId as string}
            currentUser={currentUser}
            calledToUserId={calledToUserId}
            handleClickUser={handleClickUser}
          />
          <SetupAudioVideo />
          <div className="mt-5 flex flex-col items-center justify-center space-y-5">
            <ShareButton />
            <h6 className="font-sans text-slate-400">Tip: Click on user to make call</h6>
          </div>
        </>
      )}

      {incomingCallData && (
        <IncomingCallDialog
          incomingCallData={incomingCallData}
          handleAcceptIncomingCall={handleAcceptIncomingCall}
          handleRejectIncomingCall={handleRejectIncomingCall}
        />
      )}

      {isDisconnect && <EndCallNotificationDialogue />}
    </div>
  );
}
