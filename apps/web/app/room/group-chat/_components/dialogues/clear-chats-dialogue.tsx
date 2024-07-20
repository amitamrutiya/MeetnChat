import { isOpenAtom, loadingAtom } from "@repo/store";
import {
  Button,
  Credenza,
  CredenzaTrigger,
  CredenzaContent,
  CredenzaHeader,
  CredenzaDescription,
  CredenzaTitle,
  CredenzaBody,
  CredenzaClose,
  CredenzaFooter,
} from "@repo/ui";
import { useGroup } from "hooks/use-group";
import { Trash2Icon } from "lucide-react";
import { useRecoilState, useRecoilValue } from "recoil";

const ClearChatDialogue = () => {
  const { handleClearAllGroupChat } = useGroup();
  const [isOpen, setIsOpen] = useRecoilState(isOpenAtom);
  const loading = useRecoilValue(loadingAtom);
  return (
    <Credenza open={isOpen.clearChat} onOpenChange={(value) => setIsOpen({ ...isOpen, clearChat: value })}>
      <CredenzaTrigger asChild>
        <Button className="mt-2 rounded-xl">
          <Trash2Icon className="mr-2 h-4 w-4 text-white" />
          <p className="text-white"> Clear Chats</p>
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Clear all chats</CredenzaTitle>
          <CredenzaDescription>Are you sure you want to clear all chats in this group?</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          {loading ? (
            <div className="flex w-full items-center justify-center">
              <div className="loader h-12 w-12 animate-spin rounded-full border-8 border-t-8 border-gray-200 ease-linear"></div>
            </div>
          ) : (
            <p className="text-white">Clearing all chats will remove all messages in the group</p>
          )}
        </CredenzaBody>
        <CredenzaFooter className="flex justify-end">
          <CredenzaClose>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </CredenzaClose>
          <Button variant="destructive" type="submit" onClick={handleClearAllGroupChat}>
            Clear
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default ClearChatDialogue;
