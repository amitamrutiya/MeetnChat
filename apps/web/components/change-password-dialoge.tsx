"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  toast,
} from "@repo/ui";
import { useSession } from "next-auth/react";
import { updateUserPassword } from "app/actions/user/update-user-password";

type ChangePasswordDialogeProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const ChangePasswordDialoge = ({ isOpen, setIsOpen }: ChangePasswordDialogeProps) => {
  const handleSubmit = async (event: any, currentUser: any) => {
    event.preventDefault();
    const password = event.target.password.value;
    const confirmPassword = event.target["confirm-password"].value;

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    const response = await updateUserPassword({ userId: currentUser.id, password: password });
    if (response.success) {
      toast({
        title: response.message,
      });
      setIsOpen(false);
    } else {
      toast({
        title: response.message,
        variant: "destructive",
      });
    }
  };

  const currentUser = useSession().data?.user;

  return (
    <div className="flex flex-col">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={(e) => handleSubmit(e, currentUser)}>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>Change your password to keep your account secure.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex gap-4">
                <Label htmlFor="password" className="text-white">
                  New Password
                </Label>
                <Input id="password" name="password" type="password" />
              </div>
              <div className="flex gap-4">
                <Label htmlFor="confirm-password" className="text-white">
                  Confirm New Password
                </Label>
                <Input id="confirm-password" name="confirm-password" type="password" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChangePasswordDialoge;
