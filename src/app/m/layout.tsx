import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Layout, { Footer } from "antd/lib/layout/layout";

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

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "Chatbot Arena",
  description: "Chatbot Arena powerd by AI Network.",
};

export default function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <Layout style={layoutStyle}>
          {children}
          <Footer style={footerStyle}>Powered by AI Network © 2024</Footer>
        </Layout>
      </body>
    </html>
  );
}
