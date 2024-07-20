import React from "react";
import { PencilIcon } from "lucide-react";
import {
  Button,
  Credenza,
  CredenzaTrigger,
  CredenzaContent,
  CredenzaHeader,
  CredenzaDescription,
  CredenzaTitle,
  Label,
  Input,
  CredenzaBody,
  CredenzaClose,
  CredenzaFooter,
} from "@repo/ui";
import { useGroup } from "hooks/use-group";
import { Group } from "@prisma/client";
import { isOpenAtom } from "@repo/store";
import { useRecoilState } from "recoil";

type EditGroupDialogueProps = {
  localGroup: Group | null;
  setLocalGroup: React.Dispatch<React.SetStateAction<Group | null>>;
};

const EditGroupDialogue = ({ localGroup, setLocalGroup }: EditGroupDialogueProps) => {
  const { handleEditGroup } = useGroup();
  const [isOpen, setIsOpen] = useRecoilState(isOpenAtom);

  return (
    <Credenza open={isOpen.editGroup} onOpenChange={(value) => setIsOpen({ ...isOpen, editGroup: value })}>
      <CredenzaTrigger asChild>
        <Button variant="secondary" className="rounded-xl border-2 border-white px-10">
          <PencilIcon className="mr-4 h-4 w-4 text-white" />
          Edit Group
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <form onSubmit={(e) => handleEditGroup({ event: e, localGroup: localGroup!, setLocalGroup: setLocalGroup })}>
          <CredenzaHeader>
            <CredenzaTitle>Edit Group</CredenzaTitle>
            <CredenzaDescription>Are you sure you want to edit this group?</CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="name" className="text-right text-white">
                  Name
                </Label>
                <Input id="name" name="name" type="text" defaultValue={localGroup?.name} required />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="description" className="text-right text-white">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  defaultValue={localGroup?.description ?? ""}
                  required
                />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="image" className="text-right text-white">
                  Image
                </Label>
                <Input id="image" name="image" type="url" required defaultValue={localGroup?.image ?? ""} />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="limit" className="text-right text-white">
                  Limit
                </Label>
                <Input id="limit" name="limit" type="number" defaultValue={localGroup?.limit} required />
              </div>
            </div>
          </CredenzaBody>
          <CredenzaFooter>
            <CredenzaClose>
              <Button variant="secondary" type="button">
                Close
              </Button>
            </CredenzaClose>
            <Button variant="default" type="submit">
              Edit
            </Button>
          </CredenzaFooter>
        </form>
      </CredenzaContent>
    </Credenza>
  );
};

export default EditGroupDialogue;
