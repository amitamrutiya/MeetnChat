interface User {
  socketId: string;
  username: string;
  displayPicture: string;
  platform: string;
  joinedAt: Date;
  isConnected: boolean;
}

interface RoomUser {
  id: string;
  fullname: string;
  email: string;
}
