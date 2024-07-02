export type AvailableFiles = {
  name: string;
  size: number;
  blob?: Blob;
  recievedSize?: number;
  checksum?: string;
  checksumMatched?: boolean;
  timestamp: number;
};
