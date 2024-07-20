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
import { FancyMultiSelect } from "../fancy-multi-select";
import { User } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import { useRecoilState, useRecoilValue } from "recoil";
import { isOpenAtom, loadingAtom } from "@repo/store";

const AddMemberDialogue = ({ groupMembers }: { groupMembers: User[] }) => {
  const { handleAddMembers } = useGroup();
  const [isOpen, setIsOpen] = useRecoilState(isOpenAtom);
  const loading = useRecoilValue(loadingAtom);
  return (
    <Credenza open={isOpen.addMembers} onOpenChange={(value: boolean) => setIsOpen({ ...isOpen, addMembers: value })}>
      <CredenzaTrigger asChild>
        <Button className="text-xl font-bold text-white">
          <PlusIcon className="mr-2 h-4 w-4 text-white" /> Add Members
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add Group Members</CredenzaTitle>
          <CredenzaDescription> Add members to this group</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          {loading ? (
            <div className="flex w-full items-center justify-center">
              <div className="loader h-24 w-24 animate-spin rounded-full border-8 border-t-8 border-gray-200 ease-linear"></div>
            </div>
          ) : (
            <FancyMultiSelect />
          )}
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant={"secondary"} type="button">
              Close
            </Button>
          </CredenzaClose>
          <Button onClick={(e) => handleAddMembers({ event: e, groupMembers: groupMembers })} type="submit">
            Add Members
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default AddMemberDialogue;
