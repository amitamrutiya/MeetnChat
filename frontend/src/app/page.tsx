import IconCardButton from "@/components/Icon-card-button";
import JoinRoomForm from "@/components/JoinRoomForm";
import ParticlesComponent from "@/components/particles";
import Navbar from "@/components/Navbar";
import { FlipWords } from "@/components/ui/filp-word";
import GlobeSection from "@/components/Globe";
import { Spotlight } from "@/components/ui/spot-light";

export default function Home() {
  const words = ["Omegal", "Google Meet", "Whatsapp"];
  return (
    <main className="h-dvh overflow-auto">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
      <ParticlesComponent id="particles" />
      <Navbar />
      <div className="flex flex-col items-center text-center absolute">
        <div
          className={`min-h-10vh text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 cursor-pointer animate-fadeIn my-5`}
        >
          Miss <FlipWords words={words} />
          ? <br /> All in one Website for Meet
        </div>
        <div className="flex flex-col-reverse lg:flex-row min-h-[80ovh]">
          <section className="flex-grow lg:w-2/3 flex flex-wrap justify-center items-center">
            <IconCardButton />
          </section>
          <div className="my-10 w-1 border-r-4 bg-slate-100 lg:block hidden"></div>{" "}
          <section className="join-room flex flex-grow lg:w-1/3 justify-center items-center">
            <JoinRoomForm />
          </section>
        </div>
        <GlobeSection />
      </div>
    </main>
  );
}
