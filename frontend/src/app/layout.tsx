import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { ThemeProvider } from "@/app/context/ThemeProvider";
import { SocketProvider } from "@/app/context/SocketContext";
import { MediaStreamProvider } from "@/app/context/MediaStream";
import { MediaScreenStreamProvider } from "@/app/context/ScreenStream";

import "./globals.css";
import { AudioVideoStreamProvider } from "./context/AudioVideoStream";
import { AudioVideoDevicesProvider } from "./context/AudioVideoDevices";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "MeetnChillChat",
  description:
    "Unlock the power of human connection with MeetnChillChat, where every interaction is an opportunity to broaden your horizons and enrich your life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SocketProvider>
        <UserProvider>
          <AudioVideoStreamProvider>
            <AudioVideoDevicesProvider>
              <MediaStreamProvider>
                <MediaScreenStreamProvider>
                  <body className={inter.className}>
                    <ThemeProvider
                      attribute="class"
                      defaultTheme="system"
                      enableSystem
                      disableTransitionOnChange
                    >
                      {children}
                    </ThemeProvider>
                  </body>
                </MediaScreenStreamProvider>
              </MediaStreamProvider>
            </AudioVideoDevicesProvider>
          </AudioVideoStreamProvider>
        </UserProvider>
      </SocketProvider>
    </html>
  );
}
