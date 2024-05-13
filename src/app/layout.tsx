import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Layout, { Content, Footer, Header } from "antd/lib/layout/layout";
import "./globals.css";

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  fontSize: "48px",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#ffffff",
};

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  minHeight: "80%",
  height: "80%",
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  position: "fixed",
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
        <Layout style={layoutStyle}>
          <Header style={headerStyle}>AI Network Chatbot Arena</Header>
          <Content style={contentStyle}>
              {children}
          </Content>
          <Footer style={footerStyle}>Powered by AI Network © 2024</Footer>
        </Layout>
      </body>
    </html>
  );
}
