import React from "react";
import { getRandomColorCode } from "@/utils/color";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface UserAvatarProps {
  username: string;
  src?: string;
  height?: number;
  width?: number;
}

const UserAvatar: React.FC<UserAvatarProps> = (props) => {
  const { username, src, height, width } = props;
  if (!src)
    return (
      <>
        <Avatar
          style={{
            cursor: "pointer",
            marginLeft: 1,
            marginRight: 1,
            width: height ?? 90,
            height: width ?? 90,
            backgroundColor: getRandomColorCode(),
          }}
        >
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <p className="text-lg">{username[0]}</p>
      </>
    );
  return (
    <Avatar
      style={{
        cursor: "pointer",
        marginLeft: 1,
        marginRight: 1,
        width: height ?? 90,
        height: width ?? 90,
        backgroundColor: getRandomColorCode(),
      }}
    >
      <AvatarImage src={src} />
      <AvatarFallback>{username[0]}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
