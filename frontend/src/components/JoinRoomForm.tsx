"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import formSchema from "@/lib/zodschema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

function JoinRoomForm() {
  const { user } = useUser();
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    router.push(`/room/${values.roomId}`);
  }

  return (
    <div className="mx-10 my-[70%]">
      {user ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Join meet with room Id</FormLabel>
                  <FormControl>
                    <Input placeholder="Room Id" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the room id to join the room.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      ) : (
        <div>
          <div className="text-2xl font-bold text-primary mb-5">
            Please Login to Use
          </div>
          <Link href="/api/auth/login" passHref>
            <Button className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white py-2 px-4 rounded border-2 border-transparent hover:border-purple-500 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 animate-pulse w-[100%]">
              Login
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default JoinRoomForm;
