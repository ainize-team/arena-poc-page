"use client";

import { cn } from "../utils/cn";

type UserExpBarProps = {
  userExp: number;
  className?: string;
  expBarClassname?: string;
};

export default function UserExpBar({
  userExp,
  className,
  expBarClassname,
}: UserExpBarProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-light-t3/20 default:bg-dark-t3/20",
        className,
      )}
    >
      <div
        className={cn("absolute h-full bg-orange-t1", expBarClassname)}
      ></div>
    </div>
  );
}
