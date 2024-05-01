"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const MediaStream_1 = require("@/app/context/MediaStream");
const ScreenStream_1 = require("@/app/context/ScreenStream");
const SocketContext_1 = require("@/app/context/SocketContext");
const ThemeProvider_1 = require("@/app/context/ThemeProvider");
const toaster_1 = require("@/components/ui/toaster");
const client_1 = require("@auth0/nextjs-auth0/client");
const google_1 = require("next/font/google");
const AudioVideoDevices_1 = require("./context/AudioVideoDevices");
const AudioVideoStream_1 = require("./context/AudioVideoStream");
const FileTransfer_1 = require("./context/FileTransfer");
require("./globals.css");
const inter = (0, google_1.Inter)({ subsets: ["latin"], variable: "--font-sans" });
exports.metadata = {
    title: "MeetnChillChat",
    description: "Unlock the power of human connection with MeetnChillChat, where every interaction is an opportunity to broaden your horizons and enrich your life.",
};
const providers = [
    SocketContext_1.SocketProvider,
    AudioVideoStream_1.AudioVideoStreamProvider,
    AudioVideoDevices_1.AudioVideoDevicesProvider,
    MediaStream_1.MediaStreamProvider,
    ScreenStream_1.MediaScreenStreamProvider,
    FileTransfer_1.FileTransferProvider,
];
const AppProviders = ({ children }) => {
    return providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, children);
};
function RootLayout({ children, }) {
    return (<html lang="en">
      <client_1.UserProvider>
        <AppProviders>
          <body className={inter.className}>
            <ThemeProvider_1.ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
              <toaster_1.Toaster />
            </ThemeProvider_1.ThemeProvider>
          </body>
        </AppProviders>
      </client_1.UserProvider>
    </html>);
}
exports.default = RootLayout;
