import { Spotlight } from "@/components/ui/spot-light";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
      {children}
    </div>
  );
}
