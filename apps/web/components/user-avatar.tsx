import { Avatar, AvatarImage, AvatarFallback } from "@repo/ui";
import { getRandomColorCode } from "../app/utils/color";

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

        <p className="text-lg">{username}</p>
      </>
    );
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
        <AvatarImage src={src} />
        <AvatarFallback>{username}</AvatarFallback>
      </Avatar>
      <p className="text-lg">{username}</p>
    </>
  );
};

export default UserAvatar;
