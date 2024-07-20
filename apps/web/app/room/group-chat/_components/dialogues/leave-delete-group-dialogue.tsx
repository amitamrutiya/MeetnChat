import { isOpenAtom, loadingAtom } from "@repo/store";
import {
  Button,
  Credenza,
  CredenzaTrigger,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaDescription,
  CredenzaBody,
  CredenzaFooter,
  CredenzaClose,
} from "@repo/ui";
import { useGroup } from "hooks/use-group";
import { LogOutIcon } from "lucide-react";
import { useRecoilState, useRecoilValue } from "recoil";

const LeaveDeleteGroupDialogue = ({ isCreator }: { isCreator: boolean }) => {
  const { handleDeleteGroup, handleLeaveGroup } = useGroup();

  const [isOpen, setIsOpen] = useRecoilState(isOpenAtom);
  const loading = useRecoilValue(loadingAtom);

  return (
    <Credenza open={isOpen.deleteGroup} onOpenChange={(value) => setIsOpen({ ...isOpen, deleteGroup: value })}>
      <CredenzaTrigger asChild>
        <Button variant="destructive" className="mt-2 rounded-xl">
          <LogOutIcon className="mr-2 h-4 w-4 text-white" /> {isCreator ? "Delete Group" : "Leave Group"}
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{isCreator ? "Delete Group" : "Leave Group"}</CredenzaTitle>
          <CredenzaDescription>
            Are you sure you want to
            {isCreator ? " delete " : " leave"} this group ?
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          {loading ? (
            <div className="flex w-full items-center justify-center">
              <div className="loader h-12 w-12 animate-spin rounded-full border-8 border-t-8 border-gray-200 ease-linear"></div>
            </div>
          ) : (
            <p className="text-white">
              {isCreator
                ? "Deleting the group will remove all members and chats"
                : "Leaving the group will remove you from the group"}
            </p>
          )}
        </CredenzaBody>
        <CredenzaFooter className="flex justify-end">
          <CredenzaClose>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </CredenzaClose>
          <Button variant="destructive" type="submit" onClick={isCreator ? handleDeleteGroup : handleLeaveGroup}>
            {isCreator ? "Delete" : "Leave "}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default LeaveDeleteGroupDialogue;
