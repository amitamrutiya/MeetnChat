import { FlipWords, Globe, Spotlight } from "@repo/ui";
import IconCardButton from "../components/icon-card-button";
import JoinRoomForm from "../components/join-room-form";
import Navbar from "../components/navbar";

export default function Home() {
  const words = ["Omegal", "Google Meet", "Whatsapp"];
  return (
    <main className="h-dvh overflow-auto absolute inset-0 -z-10 w-full items-center [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
      <Navbar />
      <div className="flex flex-col items-center text-center absolute">
        <div
          className={`min-h-10vh text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 cursor-pointer my-5`}
        >
          <div className="flex justify-center">
            Miss <FlipWords words={words} />?
          </div>
          All in one Website for Meet
        </div>
        <div className="flex flex-col-reverse lg:flex-row min-h-[80ovh]">
          <div className="flex-grow lg:w-2/3 flex flex-wrap justify-center items-center">
            <IconCardButton />
          </div>
          <div className="my-10 w-1 border-r-4 bg-slate-100 lg:block hidden"></div>
          <section className="join-room flex flex-grow lg:w-1/3 justify-center items-center">
            <JoinRoomForm />
          </section>
        </div>
        <Globe />
      </div>
    </main>
  );
}
