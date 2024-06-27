import { User } from "@/type";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type UsersListProps = {
  users: User[];
  roomId: string;
  currentUser: any;
  calledToUserId?: string;
  handleClickUser: (user: User) => void;
};

function UsersList(props: UsersListProps) {
  const { users, roomId, currentUser, calledToUserId, handleClickUser } = props;
  console.log(users);
  console.log(currentUser);
  console.log(roomId);
  console.log(calledToUserId);
  return (
    <div className="flex w-full items-center justify-center text-white">
      {users &&
        users
          .filter(
            (e: User) =>
              e.name !== `${currentUser?.name} - ${currentUser?.email}`
          )
          .filter((e: User) => {
            return e.roomId === roomId;
          })
          .map((user: User, index: number) => (
            <div
              key={`${user.name}-${index}`}
              onClick={() => handleClickUser(user)}
              className={
                calledToUserId && calledToUserId === user.socketId
                  ? `border-collapse rounded-3xl border-0 border-dashed border-sky-400 motion-safe:animate-bounce`
                  : ""
              }
            >
              <Avatar>
                <AvatarImage src={user.picture ?? ""} />
                <AvatarFallback>{user.name}</AvatarFallback>
              </Avatar>
            </div>
          ))}
      {(!users ||
        users.filter(
          (e: User) => e.name !== `${currentUser?.name} - ${currentUser?.email}`
        ).length <= 0) && (
        <h2 className="font-sans text-slate-400 opacity-70 motion-safe:animate-bounce">
          Join by opening this on other tab
        </h2>
      )}
    </div>
  );
}

export default UsersList;
