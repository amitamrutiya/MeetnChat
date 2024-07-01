import React, { useEffect } from "react";
import ReactPlayer from "react-player";
import { MediaStreamContext, ProviderProps } from "@/app/context/MediaStream";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/type";
import { useSession } from "next-auth/react";

interface AudioVideoBarProps {
  remoteUser: User | undefined;
  pinVideoObj: MediaStream | null;
  pinVideo: (id: string) => void;
  unPinVideo: () => void;
}

const AudioVideoBar: React.FC<AudioVideoBarProps> = (props) => {
  const { pinVideoObj, pinVideo, unPinVideo, remoteUser } = props;
  const { userStream, remoteStreams } = React.useContext(
    MediaStreamContext
  ) as ProviderProps;

  const session = useSession();
  const user = session.data?.user;
  return (
    <div className="h-full w-full rounded-md bg-transparent flex flex-col items-center ">
      <div className=" bg-foreground h-[45%] w-[69%] flex justify-center items-center border-8 border-blue-500 rounded-xl shadow-lg p-4">
        {userStream ? (
          <>
            {pinVideoObj?.id !== userStream.id && (
              <div className="group relative flex justify-center">
                <ReactPlayer
                  url={userStream}
                  muted={false}
                  playing
                  controls={false}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {pinVideoObj && pinVideoObj.id == userStream.id ? (
                  <button
                    className="absolute top-[50%] left-0 right-0 hidden group-hover:block"
                    onClick={unPinVideo}
                  >
                    <Button className="m-auto" title="UnPin video" />
                  </button>
                ) : (
                  <button
                    className="absolute top-[50%] left-0 right-0 hidden group-hover:block"
                    onClick={() => pinVideo(userStream.id)}
                  >
                    <Button className="m-auto" title="Pin video" />
                  </button>
                )}
                <span className="absolute top-[80%] left-0 right-0 hidden group-hover:block">
                  {"You"}
                </span>
              </div>
            )}
          </>
        ) : (
          <Avatar className="h-36 w-36">
            <AvatarImage
              src={user?.image?.toString() ?? "/user.png"}
              alt="User"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        )}
      </div>
      <div className="my-3" />
      <div className="bg-foreground h-[45%] w-[69%] flex justify-center items-center border-8 border-blue-500 rounded-xl shadow-lg p-4">
        {remoteStreams.length > 0 ? (
          <div>
            {remoteStreams
              .filter((stream) => stream.id !== pinVideoObj?.id)
              .map((stream) => (
                <>
                  <div className="my-5" />
                  <div className="group relative">
                    <ReactPlayer
                      key={stream.id}
                      width="100%"
                      height="100%"
                      url={stream}
                      muted={false}
                      playing
                      controls={false}
                      pip
                      className="opacity-100 group-hover:opacity-50"
                    />
                    {pinVideoObj && pinVideoObj.id == stream.id ? (
                      <button
                        className="absolute top-[50%] left-0 right-0 hidden group-hover:block"
                        onClick={unPinVideo}
                      >
                        <Button className="m-auto" title="UnPin video" />
                      </button>
                    ) : (
                      <button
                        className="absolute top-[50%] left-0 right-0 hidden group-hover:block"
                        onClick={() => pinVideo(stream.id)}
                      >
                        <Button className="m-auto" title="Pin video" />
                      </button>
                    )}
                  </div>
                </>
              ))}
          </div>
        ) : (
          <Avatar className="h-36 w-36">
            <AvatarImage
              src={remoteUser?.image?.toString() ?? "/user.png"}
              alt="User"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};

export default AudioVideoBar;
