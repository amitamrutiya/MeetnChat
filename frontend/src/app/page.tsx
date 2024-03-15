import IconCardButton from "@/components/Icon-card-button";
import JoinRoomForm from "@/components/JoinRoomForm";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Home() {
  return (
    <main className="min-h-screen h-full overflow-auto justify-center p-5">
      <ModeToggle />
      <div className="flex flex-col items-center text-center absolute w-[95vw] mx-5">
        <div
          className={`text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 cursor-pointer animate-fadeIn`}
        >
          All in one Website for Meet
        </div>{" "}
        <div className="flex justify-evenly">
          <section className="my-[10%] flex flex-wrap justify-center">
            <IconCardButton />
          </section>
          <div className="h-10 w-10"></div>
          <div className="w-1 border-r-4 bg-slate-100"></div>{" "}
          <section className="join-room">
            <JoinRoomForm />
          </section>
        </div>
      </div>
    </main>
  );
}
