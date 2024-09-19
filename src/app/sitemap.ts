import { MetadataRoute } from "next";
import { getCurrentURL } from "./../constant/constant";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: getCurrentURL(),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${getCurrentURL()}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${getCurrentURL()}/about`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
