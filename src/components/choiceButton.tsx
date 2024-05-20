"use client";

import { ArenaStatus, ChoiceType } from "@/type";
import { Button } from "antd";

type ChoiceButtonsProps = {
  value: ChoiceType,
  arenaStatus: ArenaStatus,
  onClick: Function,
  disabled?: boolean,
}

const labels: {[choice: string]: string} = {
  [ChoiceType.MODELA]: "Model A", 
  [ChoiceType.MODELB]: "Model B", 
  [ChoiceType.TIE]: "Tie", 
  [ChoiceType.NOTHING]: "Both bad", 
}

export default function ChoiceButton({value, arenaStatus, onClick, disabled = false}: ChoiceButtonsProps) {
  const onClickButton = () => {
    onClick(value);
  }
  return (
      <Button block value={value} disabled={
        (arenaStatus !== ArenaStatus.COMPETING) ||
        disabled
      } onClick={onClickButton}>{labels[value]}</Button>
  );
}