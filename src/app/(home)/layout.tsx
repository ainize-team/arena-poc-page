import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'
import Layout, { Content, Footer, Header } from "antd/lib/layout/layout";
import "../globals.css";
import RecoilRootWrapper from "@/containers/recoilRootWrapper";
import { getGAId } from "@/constant/constant";
import GoogleCaptchaWrapper from "@/containers/googleCaptchaWrapper";

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  // position: "fixed",
  height: "80px",
  bottom: 0,
  width: "100%"
};

const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
  allignItems: "center",
  width: "100%",
  maxWidth: "100%",
};

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chatbot Arena",
  description: "Chatbot Arena powerd by AI Network.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleCaptchaWrapper>
        <Layout style={layoutStyle}>
          <RecoilRootWrapper>
            {children}
          </RecoilRootWrapper>
          <Footer style={footerStyle}>Powered by AI Network © 2024</Footer>
        </Layout>
        </GoogleCaptchaWrapper>
      </body>
      <GoogleAnalytics gaId={getGAId()} />
    </html>
  );
}
