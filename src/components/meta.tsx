import { FC } from "react";
import Head from "next/head";

interface MetaProps {
  description: string;
  url: string;
}

const Meta: FC<MetaProps> = ({ description, url }) => {
  return (
    <Head>
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={"AI Network LLM Arena"} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/og_img.png" />
      <meta property="og:image:alt" content="AI Network LLM Arena" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={"AI Network LLM Arena"} />
      <meta property="og:image:secure_url" content="/og_img.png" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={"AI Network LLM Arena"} />
      <meta
        name="twitter:description"
        content={
          "AI Network LLM Arena is an open-source LLM evaluation platform that can assess models from various angles and reflect users' preferences in real-world scenarios developed by members from Common Computer and AI Network. "
        }
      />
      <meta name="twitter:image" content="/og_img.png" />
    </Head>
  );
};

export default Meta;
