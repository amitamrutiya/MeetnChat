import { MediaStreamProvider } from "@/app/context/MediaStream";
import { MediaScreenStreamProvider } from "@/app/context/ScreenStream";
import { SocketProvider } from "@/app/context/SocketContext";
import { ThemeProvider } from "@/app/context/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AudioVideoDevicesProvider } from "./context/AudioVideoDevices";
import { AudioVideoStreamProvider } from "./context/AudioVideoStream";
import { FileTransferProvider } from "./context/FileTransfer";
import "./globals.css";
import AuthProvider from "./context/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "MeetnChillChat",
  description:
    "Unlock the power of human connection with MeetnChillChat, where every interaction is an opportunity to broaden your horizons and enrich your life.",
};

const providers = [
  SocketProvider,
  AudioVideoStreamProvider,
  AudioVideoDevicesProvider,
  MediaStreamProvider,
  MediaScreenStreamProvider,
  FileTransferProvider,
];

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return providers.reduceRight(
    (children, Provider) => <Provider>{children}</Provider>,
    children
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <AppProviders>
          <body className={inter.className}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </body>
        </AppProviders>
      </AuthProvider>
    </html>
  );
}
