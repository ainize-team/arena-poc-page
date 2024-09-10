"use client";

import { cn } from "../utils/cn";

type UserExpBarProps = {
  className?: string;
  expBarClassname?: string;
  userExpPercentage?: number;
  barWidth?: number;
};

export default function UserExpBar({
  className,
  userExpPercentage = 0,
  barWidth = 0,
}: UserExpBarProps) {
  const scaleStyle = {
    width: `${userExpPercentage * 100}%`,
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-light-t3/20 default:bg-dark-t3/20",
        className,
      )}
    >
      <div
        className={cn("absolute h-full w-full rounded-full bg-orange-t1")}
        style={scaleStyle}
      ></div>
    </div>
  );
}
