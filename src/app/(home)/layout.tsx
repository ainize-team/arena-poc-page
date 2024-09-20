import type { Metadata } from "next";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import "@/src/styles/globals.css";
import RecoilRootWrapper from "@/src/containers/recoilRootWrapper";
import { getGAId, getGTMId } from "@/src/constant/constant";
import GoogleCaptchaWrapper from "@/src/containers/googleCaptchaWrapper";
import AuthContext from "@/src/containers/authContext";
import { Manrope } from "next/font/google";

export const metadata: Metadata = {
  title: "Chatbot Arena",
  description: "Chatbot Arena powerd by AI Network.",
  keywords: [
    "llm leaderboard",
    "arena leaderbord llm",
    "lmsys排行榜",
    "chatbot-arena",
    "chatbot arena",
    "lmsys leaderboard",
  ],
};

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content"
        />
      </head>
      <AuthContext>
        <body className={`${manrope.className} min-h-screen`}>
          <GoogleCaptchaWrapper>
            <main className="container">
              <RecoilRootWrapper>{children}</RecoilRootWrapper>
              <div className="flex items-stretch justify-center py-5 text-sm font-semibold leading-130 -tracking-[0.42px] text-dark-t3">
                Powered by AI Network © 2024
              </div>
            </main>
          </GoogleCaptchaWrapper>
        </body>
      </AuthContext>
      <GoogleAnalytics gaId={getGAId()} />
      <GoogleTagManager gtmId={getGTMId()} />
    </html>
  );
}
