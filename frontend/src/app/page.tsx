import IconCardButton from "@/components/Icon-card-button";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Home() {
  return (
    <main className="min-h-screen h-full overflow-auto justify-center p-5">
      <ModeToggle />
      <div className="flex flex-col items-center absolute w-[95vw]">
        <div
          className={`text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 cursor-pointer animate-fadeIn`}
        >
          All in one Website for Meet
        </div>{" "}
        <div className="flex justify-evenly">
          <section className="my-[10%] flex flex-wrap justify-center">
            <IconCardButton />
          </section>
          <section className="w-1 border-r-2 border-gray-200"></section>{" "}
        </div>
      </div>
    </main>
  );
}
