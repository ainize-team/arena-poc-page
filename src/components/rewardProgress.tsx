"use client";

import { Flex, Progress, ProgressProps } from "antd";
import { useEffect, useState } from "react";

export default function RewardProgress() {
  const [percent, setPercent] = useState(0);

  const twoColors: ProgressProps['strokeColor'] = {
    '0%': '#108ee9',
    '100%': '#87d068',
  };
  useEffect(() => {
    const getRewardPercent = async () => {
      try {
        const res = await fetch("/api/arena/reward");
        const _percent = await res.json();
        setPercent(_percent);
      } catch (_) {
        setPercent(0);
      }
    }
    getRewardPercent();
  }, [])

  return (
    <Flex gap="small" justify="flex-start" style={{ width: 600, marginBottom: "8px" }}>
      <div style={{minWidth: 260}}><h3>💰TODAY AIN REWARD REMAIN</h3></div>
      <Progress percent={Math.max(100 - percent, 0)} strokeColor={twoColors} size="small" status="active"/>
    </Flex>
  )
}