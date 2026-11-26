import type { Metadata, Viewport } from "next";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource/anton/400.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { VideoProvider } from "@/components/ui/VideoModal";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tetr College of Business — Learn Business by Doing Business Across the Globe",
  description:
    "Global Bachelor’s and Master’s programs in Management & Technology. Every term, you’ll live in a new country, build a real business, and get graded on what it earns.",
};

export const viewport: Viewport = {
  themeColor: "#08120e",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          <VideoProvider>{children}</VideoProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
