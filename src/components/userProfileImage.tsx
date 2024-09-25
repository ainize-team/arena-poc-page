"use client";

import Image from "next/image";
import DefaultUserProfile from "@/public/images/DefaultUserProfile.svg";
import BadgeTier0 from "@/public/images/badges/badgeTier0.svg";
import BadgeTier1 from "@/public/images/badges/badgeTier1.svg";
import BadgeTier2 from "@/public/images/badges/badgeTier2.svg";
import BadgeTier3 from "@/public/images/badges/badgeTier3.svg";
import BadgeTier4 from "@/public/images/badges/badgeTier4.svg";
import BadgeTier5 from "@/public/images/badges/badgeTier5.svg";
import { cn } from "../utils/cn";

type UserProfileImageProps = {
  imageUrl?: string;
  hasBadge?: boolean;
  userTier?: number;
  width: number;
  height: number;
  className?: string;
  onClick: Function;
  badgeWidth?: number;
  badgeHeight?: number;
  badgeClassName?: string;
};

export default function UserProfileImage({
  imageUrl,
  hasBadge,
  userTier,
  width,
  height,
  className,
  onClick,
  badgeWidth = 38,
  badgeHeight = 60,
  badgeClassName,
}: UserProfileImageProps) {
  const renderTierBadge = () => {
    if (!hasBadge) {
      return "";
    }
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
  //width*0.075 height*0.04
  // 0.125 / 0.15
  // bottom-[-${width * 0.075}px] right-[-${height * 0.04}px]
  return (
    <div className="relative">
      <Image
        width={width}
        height={height}
        className={cn("cursor-pointer rounded-full", className)}
        alt={"chatbot arena llm user profile image"}
        src={imageUrl ?? DefaultUserProfile}
      />
      {hasBadge && (
        <Image
          width={badgeWidth}
          height={badgeHeight}
          className={cn(`absolute z-10`, badgeClassName)}
          alt={"chatbot arena llm user profile badge image"}
          src={renderTierBadge()}
        />
      )}
    </div>
  );
}
