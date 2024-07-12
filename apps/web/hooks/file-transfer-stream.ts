import { createHmac } from "crypto";
import { useCallback, useMemo } from "react";
import peerService from "../app/helpers/peer";

function useFileTransfer() {
  const secret = useMemo(() => "$3#Ia", []);

  const handleFileTransfer = useCallback(
    (file: File): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        if (peerService.myDataChanel) {
          let buffer = await file.arrayBuffer();

          const bufferString = JSON.stringify(buffer);
          const hash = createHmac("md5", secret).update(bufferString).digest("hex");
          try {
            peerService.myDataChanel.send(
              JSON.stringify({
                name: file.name,
                size: file.size,
                checksum: hash,
              })
            );
          } catch (error) {
            reject();
          }

          let maxChunkSize = 1024 * 26;

          peerService.myDataChanel.binaryType = "arraybuffer";
          try {
            const send = () => {
              while (buffer.byteLength) {
                if (
                  peerService &&
                  peerService.myDataChanel &&
                  peerService?.myDataChanel?.bufferedAmount > peerService?.myDataChanel?.bufferedAmountLowThreshold
                ) {
                  peerService.myDataChanel.onbufferedamountlow = () => {
                    if (peerService && peerService.myDataChanel) peerService.myDataChanel.onbufferedamountlow = null;
                    send();
                  };
                  return;
                }
                const chunk = buffer.slice(0, maxChunkSize);
                buffer = buffer.slice(maxChunkSize, buffer.byteLength);
                if (peerService && peerService.myDataChanel) peerService?.myDataChanel.send(chunk);
              }
              resolve();
            };
            send();
          } catch (err) {
            reject();
          }
        }
      });
    },
    [secret]
  );

  return { handleFileTransfer };
}

export default useFileTransfer;
