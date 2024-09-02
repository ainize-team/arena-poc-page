"use client";

import { ArenaStatus, ChoiceType } from "@/src/types/type";
import { Button } from "antd";

type ChoiceButtonsProps = {
  value: ChoiceType;
  arenaStatus: ArenaStatus;
  onClick: Function;
  disabled?: boolean;
};

const labels: { [choice: string]: string } = {
  [ChoiceType.MODELA]: "Model A",
  [ChoiceType.MODELB]: "Model B",
  [ChoiceType.TIE]: "Tie",
  [ChoiceType.NOTHING]: "Both Bad",
};

export default function ChoiceButton({
  value,
  arenaStatus,
  onClick,
  disabled = false,
}: ChoiceButtonsProps) {
  const onClickButton = () => {
    onClick(value);
  };
  return (
    <button
      className="chat items-center justify-center rounded-lg border border-light-l2 bg-light-b4 px-3 py-2 text-sm font-bold text-light-t2 hover:bg-light-b3 disabled:opacity-50 dark:border-dark-b4 dark:bg-dark-b4 dark:text-light dark:hover:bg-dark-b3"
      disabled={arenaStatus !== ArenaStatus.COMPETING || disabled}
      onClick={onClickButton}
      value={value}
    >
      {labels[value]}
    </button>
  );
}
