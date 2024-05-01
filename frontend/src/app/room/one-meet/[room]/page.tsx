"use client";

import Navbar from "@/components/Navbar";
import IncomingCallDialog from "@/components/IncomingCallDialog";
import UsersList from "@/components/UsersList";
import SetupAudioVideo from "@/components/SetupAudioVideo";
import { ShareButton } from "@/components/ShareButton";
import MeetDashboard from "@/components/MeetDashboard";
import { useRoom } from "@/app/hooks/useRoom";

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
      <Navbar remoteSocketId={remoteSocketId} remoteUser={remoteUser} />

      {remoteSocketId && (
        <MeetDashboard
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