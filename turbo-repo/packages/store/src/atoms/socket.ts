import { atom } from 'recoil';
import { Socket } from 'socket.io-client';

// Step 1: Define a Recoil atom for the socket state
export const socketStateAtom = atom<Socket | null>({
  key: 'socketStateAtom', // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});
