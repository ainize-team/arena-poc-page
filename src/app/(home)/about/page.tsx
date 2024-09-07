"use client";

import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
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
  const [theme, setTheme] = useRecoilState(themeAtom);

  const [tabState, setTabState] = useState("ARENA");
  const [currentTheme, setCurrentTheme] = useState("light");

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

  const renderTabState = () => {
    switch (tabState) {
      case "ARENA":
        return (
          <>
            <Image src={AboutArena} alt="about arena" />
            <div className="flex flex-[1_0_0%] items-start self-stretch text-left text-base leading-150 text-dark dark:text-light">
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
                {`Users receive answers to their questions from two randomly
                assigned LLM models and can vote for the model that provided the
                better response.`}
              </ReactMarkdown>
            </div>
          </>
        );
      case "LEADERBOARD":
        return (
          <>
            <Image src={AboutLeaderboard} alt="about leaderboard" />
            <div className="flex flex-[1_0_0%] items-start self-stretch text-left text-base leading-150 text-dark dark:text-light">
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
                {`Chat logs and model voting results collected in the Arena are
              stored, and statistical techniques are used to measure the
              rankings of LLM models based on this data.`}
              </ReactMarkdown>
            </div>
          </>
        );
      case "TIER":
        return (
          <>
            <Image src={AboutTier} alt="about tier" />
            <div className="flex flex-[1_0_0%] items-start self-stretch text-left text-base leading-150 text-dark dark:text-light">
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
                {`**1. Tier Promotion**\n\nA score between 0 and 1 is given based on the quality of the question, and as experience points accumulate, the user's tier level increases.\n\nStart at Tier 0 upon first login\n\nReach 20 EXP at Tier 0 → Promote to Tier 1\n\nReach 50 EXP at Tier 1 → Promote to Tier 2\n\nReach 80 EXP at Tier 2 → Promote to Tier 3\n\nReach 150 EXP at Tier 3 → Promote to Tier 4\n\nReach 230 EXP at Tier 4 → Promote to Tier 5\n\n**2. Tier Demotion**\n\nIf any attention check questions embedded within the prompts are answered incorrectly, the user will be demoted by one tier. Users will also be demoted if they do not log in for more than three days.`}
              </ReactMarkdown>
            </div>
          </>
        );
      case "REWARD":
        return (
          <>
            <Image src={AboutReward} alt="about reward" />
            <div className="flex flex-[1_0_0%] items-start self-stretch text-left text-base leading-150 text-dark dark:text-light">
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
                {`Rewards are distributed based on tier level. As the tier level rises, the rewards become greater.\n\n**Tier 0** :  No rewards\n\n**Tier 1** :  Average reward 10 credits\n\n**Tier 2** :  1.5x Tier 1 reward.\n\n**Tier 3** :  2x Tier 1 reward.\n\n**Tier 4** :  2.5 x Tier 1 reward.\n\n**Tier 5** :  3 x Tier 1 reward.`}
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
          <div className="text-3.5xl font-bold leading-150 text-dark dark:text-light">
            About US
          </div>
          <div className="text-base font-normal leading-150 text-dark dark:text-light">
            AI Network LLM Arena is an open-source LLM evaluation platform that
            can assess models from various angles and reflect users' preferences
            in real-world scenarios developed by members from Common Computer
            and AI Network. Our mission is to build a collaborative computing
            network to realize the internet of value. We invite everyone to join
            us!
          </div>
        </div>
        <div className="flex flex-col items-start gap-5 self-stretch">
          <div className="flex flex-row items-start self-stretch max-desktop:justify-between max-desktop:gap-2 min-desktop:gap-10">
            <div
              className={cn(
                "cursor-pointer pb-[10px] font-medium leading-10 text-dark max-desktop:flex-[1_0_0%] min-desktop:text-xl dark:text-light",
                tabState === "ARENA" &&
                  "border-b-2 border-b-dark font-bold dark:border-b-light",
              )}
              onClick={() => setTabState("ARENA")}
            >
              Arena
            </div>
            <div
              className={cn(
                "cursor-pointer pb-[10px] font-medium leading-10 text-dark max-desktop:flex-[1_0_0%] min-desktop:text-xl dark:text-light",
                tabState === "LEADERBOARD" &&
                  "border-b-2 border-b-dark font-bold dark:border-b-light",
              )}
              onClick={() => setTabState("LEADERBOARD")}
            >
              LeaderBoard
            </div>
            <div
              className={cn(
                "cursor-pointer pb-[10px] font-medium leading-10 text-dark max-desktop:flex-[1_0_0%] min-desktop:text-xl dark:text-light",
                tabState === "TIER" &&
                  "border-b-2 border-b-dark font-bold dark:border-b-light",
              )}
              onClick={() => setTabState("TIER")}
            >
              Tier & EXP
            </div>
            <div
              className={cn(
                "cursor-pointer pb-[10px] font-medium leading-10 text-dark max-desktop:flex-[1_0_0%] min-desktop:text-xl dark:text-light",
                tabState === "REWARD" &&
                  "border-b-2 border-b-dark font-bold dark:border-b-light",
              )}
              onClick={() => setTabState("REWARD")}
            >
              Reward
            </div>
          </div>
          <div className="flex justify-start gap-10 self-stretch py-5 max-desktop:flex-col max-desktop:items-center min-desktop:flex-row min-desktop:items-start">
            {renderTabState()}
          </div>
        </div>
        <div className="flex flex-col items-start gap-6">
          <div className="flex flex-col items-center gap-5 text-3.5xl font-bold leading-150 text-dark dark:text-light">
            Join the community
          </div>
          <div className="flex items-start justify-center gap-6 self-stretch max-desktop:flex-col min-desktop:flex-row">
            <div className="flex h-[100px] flex-[1_0_0%] items-center gap-4 rounded-2xl bg-light px-5 py-[10px] max-desktop:w-full">
              <Image
                src={AINetworkLogo}
                alt="ainetwork logo"
                className="h-16 w-16"
              />
              <div className="flex flex-col items-start gap-[6px]">
                <div className="feading-150 text-base font-bold text-dark">
                  AI Network
                </div>
                <div className="text-sm leading-5 text-dark">
                  Follow our latest news
                </div>
              </div>
            </div>
            <div className="flex h-[100px] flex-[1_0_0%] items-center gap-4 rounded-2xl bg-light px-5 py-[10px] max-desktop:w-full">
              <Image src={XLogo} alt="x logo" className="h-16 w-16" />
              <div className="flex flex-col items-start gap-[6px]">
                <div className="feading-150 text-base font-bold text-dark">
                  Twitter
                </div>
                <div className="text-sm leading-5 text-dark">
                  Follow our latest news
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-start justify-center gap-6 self-stretch max-desktop:flex-col min-desktop:flex-row">
            <div className="flex h-[100px] flex-[1_0_0%] items-center gap-4 rounded-2xl bg-light px-5 py-[10px] max-desktop:w-full">
              <Image
                src={DiscordLogo}
                alt="discord logo"
                className="h-16 w-16"
              />
              <div className="flex flex-col items-start gap-[6px]">
                <div className="feading-150 text-base font-bold text-dark">
                  Discord
                </div>
                <div className="text-sm leading-5 text-dark">
                  Join global community
                </div>
              </div>
            </div>
            <div className="flex h-[100px] flex-[1_0_0%] items-center gap-4 rounded-2xl bg-light px-5 py-[10px] max-desktop:w-full">
              <Image
                src={TelegramLogo}
                alt="telegram logo"
                className="h-16 w-16"
              />
              <div className="flex flex-col items-start gap-[6px]">
                <div className="feading-150 text-base font-bold text-dark">
                  Telegram
                </div>
                <div className="text-sm leading-5 text-dark">
                  Join global community
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
