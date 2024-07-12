"use client";

import EndCallNotificationDialogue from "components/end-call-notification-dialogue";
import IncomingCallDialog from "components/incoming-call-dialogue";
import MeetDashboard from "components/meet-dashboard";
import RoomNavbar from "components/room-navbar";
import SetupAudioVideo from "components/setup-audio-video";
import { ShareButton } from "components/share-button";
import UsersList from "components/user-list";
import { useRoom } from "hooks/use-room";

export default function Room() {
  const {
    users,
    whiteboardID,
    remoteUser,
    remoteSocketId,
    incomingCallData,
    calledToUserId,
    currentUser,
    roomId,
    isDisconnect,
    handleClickUser,
    handleAcceptIncomingCall,
    handleRejectIncomingCall,
  } = useRoom();

  return (
    <div className="flex h-dvh flex-col justify-between p-5">
      <RoomNavbar remoteSocketId={remoteSocketId} remoteUser={remoteUser} />

      {remoteSocketId && <MeetDashboard remoteSocketId={remoteSocketId} whiteboardID={whiteboardID} />}

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
