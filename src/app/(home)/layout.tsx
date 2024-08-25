import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Layout, { Content, Footer, Header } from "antd/lib/layout/layout";
import "../globals.css";
import RecoilRootWrapper from "@/src/containers/recoilRootWrapper";
import { getGAId } from "@/src/constant/constant";
import GoogleCaptchaWrapper from "@/src/containers/googleCaptchaWrapper";
import AuthContext from "@/src/containers/authContext";
// import "./globals.css";
import Navbar from "@/src/components/Navbar";
import { cn } from "@/src/utils/cn";

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  // position: "fixed",
  height: "80px",
  bottom: 0,
  width: "100%",
};

const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
  allignItems: "center",
  width: "100%",
  maxWidth: "100%",
};

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
      <AuthContext>
        <body>
          <GoogleCaptchaWrapper>
            <Navbar />
            <main className="container">
              <RecoilRootWrapper>{children}</RecoilRootWrapper>
              <Footer style={footerStyle}>Powered by AI Network © 2024</Footer>
            </main>
            {/* <Layout style={layoutStyle}>
              <RecoilRootWrapper>{children}</RecoilRootWrapper>
              <Footer style={footerStyle}>Powered by AI Network © 2024</Footer>
            </Layout> */}
          </GoogleCaptchaWrapper>
        </body>
      </AuthContext>
      <GoogleAnalytics gaId={getGAId()} />
    </html>
  );
}
