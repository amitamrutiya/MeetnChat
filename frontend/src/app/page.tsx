import IconCardButton from "@/components/Icon-card-button";
import JoinRoomForm from "@/components/JoinRoomForm";
import { ModeToggle } from "@/components/ui/mode-toggle";
import ParticlesComponent from "@/components/particles";
import LogoutButton from "@/components/LogoutButton";

export default function Home() {
  return (
    <main className="h-dvh overflow-auto">
      <ParticlesComponent id="particles" />
      <ModeToggle />
      <LogoutButton />

      <div className="flex flex-col items-center text-center absolute">
        <div
          className={`min-h-10vh text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 cursor-pointer animate-fadeIn my-5`}
        >
          All in one Website for Meet
        </div>
        <div className="flex flex-col-reverse lg:flex-row min-h-[90vh]">
          <section className="flex-grow lg:w-2/3 flex flex-wrap justify-center items-center">
            <IconCardButton />
          </section>
          <div className="my-10 w-1 border-r-4 bg-slate-100 lg:block hidden"></div>{" "}
          <section className="join-room flex flex-grow lg:w-1/3 justify-center items-center">
            <JoinRoomForm />
          </section>
        </div>
      </div>
    </main>
  );
}
