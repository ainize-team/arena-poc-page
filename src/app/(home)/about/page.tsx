"use client";

import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "@/src/utils/cn";
import { themeAtom } from "@/src/lib/recoil";

import AboutArena from "@/src/assets/images/aboutArena.svg";
import AboutLeaderboard from "@/src/assets/images/aboutLeaderboard.svg";
import AboutTier from "@/src/assets/images/aboutTier.svg";
import AboutReward from "@/src/assets/images/aboutReward.svg";
import AINetworkLogo from "@/public/images/logo/AINetworkLogo.svg";
import XLogo from "@/public/images/logo/XLogo.svg";
import DiscordLogo from "@/public/images/logo/DiscordLogo.svg";
import TelegramLogo from "@/public/images/logo/TelegramLogo.svg";

export default function Home() {
  const router = useRouter();
  const [theme, setTheme] = useRecoilState(themeAtom);

  const [tabState, setTabState] = useState("ARENA");
  const [currentTheme, setCurrentTheme] = useState("light");

  const handleTabClick = (tabName: string) => {
    setTabState(tabName);
    const params = new URLSearchParams({
      tab: tabName,
    });
    router.push(`/about?${params.toString()}`);
  };

  const checkTheme = (theme: string) => {
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setCurrentTheme(systemTheme);
    } else {
      setCurrentTheme(theme);
    }
  };

  useEffect(() => {
    checkTheme(theme);
  }, [theme]);

  useEffect(() => {
    const queryTab = new URLSearchParams(window.location.search).get("tab");
    if (queryTab) {
      setTabState(queryTab);
    }
  }, []);

  const renderTabState = () => {
    switch (tabState) {
      case "ARENA":
        return (
          <>
            <div className="flex overflow-hidden rounded-xl bg-light">
              <Image
                src={AboutArena}
                alt="about arena"
                width={400}
                height={240}
                className="h-[240px] w-[400px]"
              />
            </div>
            <div className="flex flex-[1_0_0%] items-start self-stretch text-left leading-150 text-dark max-desktop:text-sm min-desktop:text-base dark:text-light">
              <ReactMarkdown
                className={cn(
                  currentTheme === "light"
                    ? "markdown-content"
                    : "markdown-contentDark",
                )}
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {`Users receive answers to their questions from two randomly assigned LLM models and can vote for the model that provided the better response.`}
              </ReactMarkdown>
            </div>
          </>
        );
      case "LEADERBOARD":
        return (
          <>
            <div className="flex overflow-hidden rounded-xl bg-light">
              <Image
                src={AboutLeaderboard}
                alt="about leaderboard"
                width={400}
                height={240}
                className="h-[240px] w-[400px]"
              />
            </div>
            <div className="flex flex-[1_0_0%] items-start self-stretch text-left leading-150 text-dark max-desktop:text-sm min-desktop:text-base dark:text-light">
              <ReactMarkdown
                className={cn(
                  currentTheme === "light"
                    ? "markdown-content"
                    : "markdown-contentDark",
                )}
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {`Chat logs and model voting results collected in the Arena are stored, and statistical techniques are used to measure the rankings of LLM models based on this data.`}
              </ReactMarkdown>
            </div>
          </>
        );
      case "TIER":
        return (
          <>
            <div className="flex overflow-hidden rounded-xl bg-light">
              <Image
                src={AboutTier}
                alt="about tier"
                width={400}
                height={240}
                className="h-[240px] w-[400px]"
              />
            </div>
            <div className="flex flex-[1_0_0%] items-start self-stretch text-left leading-150 text-dark max-desktop:text-sm min-desktop:text-base dark:text-light">
              <ReactMarkdown
                className={cn(
                  currentTheme === "light"
                    ? "markdown-content"
                    : "markdown-contentDark",
                )}
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {`A score between 0 and 1 is given based on the quality of the question, and as experience points accumulate, the user's tier level increases.\n\n- Start at Tier 0 upon first login\n- Reach 20 EXP at Tier 0 → Promote to Tier 1\n- Reach 50 EXP at Tier 1 → Promote to Tier 2\n- Reach 80 EXP at Tier 2 → Promote to Tier 3\n- Reach 150 EXP at Tier 3 → Promote to Tier 4\n- Reach 230 EXP at Tier 4 → Promote to Tier 5`}
              </ReactMarkdown>
            </div>
          </>
        );
      case "REWARD":
        return (
          <>
            <div className="flex overflow-hidden rounded-xl bg-light">
              <Image
                src={AboutReward}
                alt="about reward"
                width={400}
                height={240}
                className="h-[240px] w-[400px]"
              />
            </div>
            <div className="flex flex-[1_0_0%] items-start self-stretch text-left leading-150 text-dark max-desktop:text-sm min-desktop:text-base dark:text-light">
              <ReactMarkdown
                className={cn(
                  currentTheme === "light"
                    ? "markdown-content"
                    : "markdown-contentDark",
                )}
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {`Rewards are distributed based on tier level.\n\nAs the tier level rises, the rewards become greater.\n- **Tier 0** :  No rewards\n- **Tier 1** :  Average reward 0.5 credits\n- **Tier 2** :  1.5 x Tier 1 reward.\n- **Tier 3** :  2 x Tier 1 reward.\n- **Tier 4** :  2.5 x Tier 1 reward.\n- **Tier 5** :  3 x Tier 1 reward.`}
              </ReactMarkdown>
            </div>
          </>
        );
    }
  };

  return (
    <main className="">
      <div className="flex flex-col gap-10 max-desktop:px-4 min-desktop:px-0 min-desktop:py-10">
        <div className="flex flex-col items-start gap-6 text-left">
          <div className="font-bold leading-150 text-dark max-desktop:text-2xl min-desktop:text-3.5xl dark:text-light">
            About US
          </div>
          <div className="font-normal leading-150 text-dark max-desktop:text-sm min-desktop:text-base dark:text-light">
            <ReactMarkdown
              className={cn(
                currentTheme === "light"
                  ? "markdown-content"
                  : "markdown-contentDark",
              )}
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                ),
              }}
            >
              {`AI Network LLM Arena is an open-source LLM evaluation platform that can assess models from various angles and reflect users' preferences in real-world scenarios developed by members from Common Computer and AI Network. Our mission is to build a collaborative computing network to realize the internet of value. We invite everyone to join us!`}
            </ReactMarkdown>
          </div>
        </div>
        <div className="flex flex-col items-start gap-5 self-stretch">
          <div className="flex flex-row items-start self-stretch max-desktop:justify-between max-desktop:gap-2 min-desktop:gap-10">
            <div
              className={cn(
                "cursor-pointer pb-[10px] font-medium text-dark max-desktop:flex-[1_0_0%] max-desktop:text-sm max-desktop:leading-6 min-desktop:text-xl min-desktop:leading-10 dark:text-light",
                tabState === "ARENA" &&
                  "border-b-2 border-b-dark font-bold dark:border-b-light",
              )}
              onClick={() => handleTabClick("ARENA")}
            >
              Arena
            </div>
            <div
              className={cn(
                "cursor-pointer pb-[10px] font-medium text-dark max-desktop:flex-[1_0_0%] max-desktop:text-sm max-desktop:leading-6 min-desktop:text-xl min-desktop:leading-10 dark:text-light",
                tabState === "LEADERBOARD" &&
                  "border-b-2 border-b-dark font-bold dark:border-b-light",
              )}
              onClick={() => handleTabClick("LEADERBOARD")}
            >
              Leaderboard
            </div>
            <div
              className={cn(
                "cursor-pointer pb-[10px] font-medium text-dark max-desktop:flex-[1_0_0%] max-desktop:text-sm max-desktop:leading-6 min-desktop:text-xl min-desktop:leading-10 dark:text-light",
                tabState === "TIER" &&
                  "border-b-2 border-b-dark font-bold dark:border-b-light",
              )}
              onClick={() => handleTabClick("TIER")}
            >
              Tier & EXP
            </div>
            <div
              className={cn(
                "cursor-pointer pb-[10px] font-medium text-dark max-desktop:flex-[1_0_0%] max-desktop:text-sm max-desktop:leading-6 min-desktop:text-xl min-desktop:leading-10 dark:text-light",
                tabState === "REWARD" &&
                  "border-b-2 border-b-dark font-bold dark:border-b-light",
              )}
              onClick={() => handleTabClick("REWARD")}
            >
              Reward
            </div>
          </div>
          <div className="flex justify-start gap-10 self-stretch max-desktop:flex-col max-desktop:items-center min-desktop:flex-row min-desktop:items-start">
            {renderTabState()}
          </div>
        </div>
        <div className="flex flex-col items-start max-desktop:gap-4 min-desktop:gap-6">
          <div className="flex flex-col items-center gap-5 font-bold leading-150 text-dark max-desktop:text-2xl min-desktop:text-3.5xl dark:text-light">
            Join the community
          </div>
          <div className="flex items-start justify-center self-stretch max-desktop:flex-col max-desktop:gap-4 min-desktop:flex-row min-desktop:gap-6">
            <Link
              href={"https://www.ainetwork.ai/"}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex h-[100px] flex-[1_0_0%] items-center gap-4 rounded-2xl bg-light px-5 py-[10px] max-desktop:w-full dark:bg-dark-b3",
              )}
            >
              <Image
                src={AINetworkLogo}
                alt="ainetwork logo"
                className="h-16 w-16"
              />
              <div className="flex flex-col items-start gap-[6px]">
                <div className="feading-150 text-base font-bold text-dark dark:text-light">
                  AI Network
                </div>
                <div className="text-sm leading-5 text-dark dark:text-light">
                  Follow our latest news
                </div>
              </div>
            </Link>
            <Link
              href={"https://x.com/ainetwork_ai"}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex h-[100px] flex-[1_0_0%] items-center gap-4 rounded-2xl bg-light px-5 py-[10px] max-desktop:w-full dark:bg-dark-b3",
              )}
            >
              <Image
                src={XLogo}
                alt="x logo"
                className="m-[5px] h-[54px] w-[54px]"
              />
              <div className="flex flex-col items-start gap-[6px]">
                <div className="feading-150 text-base font-bold text-dark dark:text-light">
                  Twitter
                </div>
                <div className="text-sm leading-5 text-dark dark:text-light">
                  Follow our latest news
                </div>
              </div>
            </Link>
          </div>
          <div className="flex items-start justify-center self-stretch max-desktop:flex-col max-desktop:gap-4 min-desktop:flex-row min-desktop:gap-6">
            <Link
              href={"https://discord.gg/ZWEx46mhsb"}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex h-[100px] flex-[1_0_0%] items-center gap-4 rounded-2xl bg-light px-5 py-[10px] max-desktop:w-full dark:bg-dark-b3",
              )}
            >
              <Image
                src={DiscordLogo}
                alt="discord logo"
                className="h-16 w-16"
              />
              <div className="flex flex-col items-start gap-[6px]">
                <div className="feading-150 text-base font-bold text-dark dark:text-light">
                  Discord
                </div>
                <div className="text-sm leading-5 text-dark dark:text-light">
                  Join global community
                </div>
              </div>
            </Link>
            <Link
              href={"https://t.me/ainetwork_en"}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex h-[100px] flex-[1_0_0%] items-center gap-4 rounded-2xl bg-light px-5 py-[10px] max-desktop:w-full dark:bg-dark-b3",
              )}
            >
              <Image
                src={TelegramLogo}
                alt="telegram logo"
                className="m-[5px] h-[54px] w-[54px]"
              />
              <div className="flex flex-col items-start gap-[6px]">
                <div className="feading-150 text-base font-bold text-dark dark:text-light">
                  Telegram
                </div>
                <div className="text-sm leading-5 text-dark dark:text-light">
                  Join global community
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
