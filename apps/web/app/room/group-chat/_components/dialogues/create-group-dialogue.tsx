import {
  Button,
  Input,
  Credenza,
  CredenzaTrigger,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaDescription,
  CredenzaBody,
  Label,
  CredenzaFooter,
  CredenzaClose,
} from "@repo/ui";
import { useGroup } from "hooks/use-group";
import { PlusIcon } from "lucide-react";
import { FancyMultiSelect } from "../fancy-multi-select";
import { isOpenAtom, loadingAtom } from "@repo/store";
import { useRecoilState, useRecoilValue } from "recoil";

const CreateGroupDialogue = () => {
  const { fetchInviteUserList, handleCreatGroup } = useGroup();
    const [isOpen, setIsOpen] = useRecoilState(isOpenAtom);
    const loading = useRecoilValue(loadingAtom);
  return (
    <Credenza open={isOpen.createGroup} onOpenChange={(value) => setIsOpen({ ...isOpen, createGroup: value })}>
      <CredenzaTrigger asChild>
        <Button className="w-full text-xl font-bold text-white" onClick={async () => await fetchInviteUserList()}>
          <PlusIcon className="mr-2 h-4 w-4 text-white" /> Create Group
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        {loading ? (
          <div className="flex min-h-96 w-full items-center justify-center">
            <div className="loader h-24 w-24 animate-spin rounded-full border-8 border-t-8 border-gray-200 ease-linear"></div>
          </div>
        ) : (
          <form onSubmit={(e) => handleCreatGroup(e)}>
            <CredenzaHeader>
              <CredenzaTitle>Create Group</CredenzaTitle>
              <CredenzaDescription>Enjoy Group Chat with your friends together</CredenzaDescription>
            </CredenzaHeader>
            <CredenzaBody>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="name" className="text-right text-white">
                    Name
                  </Label>
                  <Input id="name" name="name" type="text" required />
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="description" className="text-right text-white">
                    Description
                  </Label>
                  <Input id="description" name="description" type="text" />
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="limit" className="text-right text-white">
                    Limit
                  </Label>
                  <Input id="limit" name="limit" type="number" required />
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="profile" className="text-right text-white">
                    Image
                  </Label>
                  <Input id="image" name="image" type="url" />
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-right text-white">Members</Label>
                  <FancyMultiSelect />
                </div>
              </div>
            </CredenzaBody>
            <CredenzaFooter>
              <CredenzaClose className="flex gap-4">
                <Button variant={"secondary"}>Close</Button>
              </CredenzaClose>
              <Button type="submit">Create</Button>
            </CredenzaFooter>
          </form>
        )}
      </CredenzaContent>
    </Credenza>
  );
};

export default CreateGroupDialogue;
