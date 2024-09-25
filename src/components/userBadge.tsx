"use client";

import Image from "next/image";
import BadgeTier0 from "@/public/images/badges/badgeTier0.svg";
import BadgeTier1 from "@/public/images/badges/badgeTier1.svg";
import BadgeTier2 from "@/public/images/badges/badgeTier2.svg";
import BadgeTier3 from "@/public/images/badges/badgeTier3.svg";
import BadgeTier4 from "@/public/images/badges/badgeTier4.svg";
import BadgeTier5 from "@/public/images/badges/badgeTier5.svg";
import { cn } from "../utils/cn";

type UserBadgeProps = {
  userTier?: number;
};

export default function UserBadge({ userTier }: UserBadgeProps) {
  const renderTierBadge = () => {
    switch (userTier) {
      case 1:
        return BadgeTier1;
      case 2:
        return BadgeTier2;
      case 3:
        return BadgeTier3;
      case 4:
        return BadgeTier4;
      case 5:
        return BadgeTier5;
      default:
        return BadgeTier0;
    }
  };

  return (
    <div className="">
      <Image
        width={20}
        height={32}
        className=""
        alt={"chatbot arena user profile badge image"}
        src={renderTierBadge()}
      />
    </div>
  );
}
