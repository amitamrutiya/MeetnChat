"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  toast,
} from "@repo/ui";
import { updateUser } from "app/actions/user/update-user";
import { AudioLines } from "lucide-react";
import { useSession } from "next-auth/react";

type EditProfileDialogeProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const EditProfileDialoge = ({ isOpen, setIsOpen }: EditProfileDialogeProps) => {
  const handleSubmit = async (event: any, currentUser: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData.entries());
    if (
      userData.name === currentUser.name &&
      userData.username === currentUser.username &&
      userData.bio === currentUser.bio &&
      userData.phone === currentUser.phone_number &&
      userData.profile === currentUser.image
    ) {
      setIsOpen(false);
      return;
    }

    if (userData.name) currentUser.name = userData.name;
    if (userData.username) currentUser.username = userData.username;
    if (userData.bio) currentUser.bio = userData.bio;
    if (userData.phone) currentUser.phone_number = userData.phone;
    if (userData.profile) currentUser.image = userData.profile;

    // Assuming updateUser is an async function that updates the user's data
    console.log(userData);
    const response = await updateUser({
      id: currentUser.id,
      name: userData.name ?? currentUser.name,
      username: userData.username ?? currentUser.username,
      bio: userData.bio ?? currentUser.bio,
      phone_number: userData.phone ?? currentUser.phone_number,
      image: userData.image ?? currentUser.image,
    });
    if (response.success) {
      currentUser = response.data;
      toast({
        title: response.message,
      });
    } else {
      toast({
        title: response.message,
      });
    }
    setIsOpen(false);
  };

  // const [isOpen, setIsOpen] = useState(false);
  const currentUser = useSession().data?.user;

  return (
    <div className="flex flex-col items-center">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="my-4 rounded-3xl px-10">
            Edit Contact
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={(e) => handleSubmit(e, currentUser)}>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="name" className="text-right text-white">
                  Name
                </Label>
                <Input id="name" name="name" defaultValue={currentUser?.name ?? ""} />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="username" className="text-right text-white">
                  Username
                </Label>
                <Input id="username" name="username" defaultValue={currentUser?.username ?? ""} />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="bio" className="text-right text-white">
                  Bio
                </Label>
                <Input id="bio" name="bio" defaultValue={currentUser?.bio} />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="phone" className="text-right text-white">
                  Mobile
                </Label>
                <Input id="phone" name="phone" defaultValue={currentUser?.phone_number ?? ""} />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="profile" className="text-right text-white">
                  Profile
                </Label>
                <Input id="profile" name="profile" defaultValue={currentUser?.image ?? ""} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <footer className="my-6 flex items-center justify-center align-middle font-sans text-xl font-bold antialiased">
        <AudioLines className="mr-2 inline" />
        Meet <span className="text-sky-400/100"> ChillChat</span>
      </footer>
    </div>
  );
};

export default EditProfileDialoge;
