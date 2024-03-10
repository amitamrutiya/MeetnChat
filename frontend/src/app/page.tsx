import { ModeToggle } from "@/components/ui/theme-button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="h-full flex min-h-screen flex-col items-center justify-between p-24">
      Hello
      <ModeToggle />
    </main>
  );
}
