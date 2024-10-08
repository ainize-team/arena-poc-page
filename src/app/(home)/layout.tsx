import type { Metadata } from "next";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import "@/src/styles/globals.css";
import RecoilRootWrapper from "@/src/containers/recoilRootWrapper";
import { getCurrentURL, getGAId, getGTMId } from "@/src/constant/constant";
import GoogleCaptchaWrapper from "@/src/containers/googleCaptchaWrapper";
import AuthContext from "@/src/containers/authContext";
import { Manrope } from "next/font/google";

export const metadata: Metadata = {
  title: "Chatbot Arena",
  description: "Chatbot Arena powered by AI Network.",
  keywords: [
    "llm leaderboard",
    "arena leaderboard llm",
    "lmsys排行榜",
    "chatbot-arena",
    "chatbot arena",
    "lmsys leaderboard",
  ],
  openGraph: {
    type: "website",
    url: getCurrentURL(),
    title: "AI Network LLM Arena",
    description: "AI Network LLM Arena",
    siteName: "AI Network LLM Arena",
    images: [
      {
        url: "/og_img.png",
        alt: "AI Network LLM Arena",
        width: "1200",
        height: "630",
        secureUrl: "/og_img.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: "/og_img.png",
    title: "AI Network LLM Arena",
    description: "AI Network LLM Arena",
  },
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
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <meta name="msapplication-TileColor" content="#f1f3f7" />
        <meta name="theme-color" content="#f1f3f7" />
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
