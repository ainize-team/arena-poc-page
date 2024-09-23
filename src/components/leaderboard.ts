"use client";

import { LeaderboardTableData } from "@/src/types/type";
import { PUBLIC_ENV } from "../constant/constant";

const MINIMUM_VOTE = Number(PUBLIC_ENV.MINIMUM_VOTE || 100);
type LeaderboardResponse = {
  updated_at: string;
  leaderboard: LeaderboardModelData[];
};

type LeaderboardModelData = {
  rank: number;
  model_name: string;
  elo_score: number;
  "95%_CI": Array<number>;
  votes: number;
  link: string;
  organization: string;
  license: string;
};

export const getLeaderboard = async () => {
  const res = await fetch("/api/leaderboard", { cache: "no-cache" });
  const leaderboard: LeaderboardResponse = await res.json();
  const lastUpdatedTS = Date.parse(leaderboard.updated_at);
  const lastUpdatedString = dateFormat(lastUpdatedTS);
  const tableData = leaderboardToTableData(leaderboard.leaderboard);
  return {
    lastUpdated: lastUpdatedString,
    tableData,
  };
};

const leaderboardToTableData = (modelDatas: LeaderboardModelData[]) => {
  const tableData: LeaderboardTableData[] = [];
  for (const [index, datas] of Object.entries(modelDatas)) {
    const numIndex = Number(index);
    const ci = datas["95%_CI"];
    const data: LeaderboardTableData = {
      key: numIndex,
      rank: "🔥",
      ci:
        datas.votes < MINIMUM_VOTE ? "- / -" : stringifyCI(datas.elo_score, ci),
      elo: datas.votes < MINIMUM_VOTE ? "-" : datas.elo_score.toFixed(0),
      modelName: datas.model_name,
      link: datas.link,
      votes: datas.votes,
      license: datas.license,
      org: datas.organization,
    };
    tableData.push(data);
  }
  tableData.sort((a, b) => {
    const eloA = a.elo !== "-" ? Number(a.elo) : -999999;
    const eloB = b.elo !== "-" ? Number(b.elo) : -999999;
    if (eloA < eloB) return 1;
    return -1;
  });
  let count = 1;
  tableData.forEach((data) => {
    if (data.elo !== "-") data.rank = makeRankText(count++);
  });

  return tableData;
};

const makeRankText = (rank: number) => {
  if (rank === 1) return `🥇 1`;
  else if (rank === 2) return `🥈 2`;
  else if (rank === 3) return `🥉 3`;
  else return `${rank}`;
};

const stringifyCI = (eloScore: number, ci: Array<number>): string => {
  if (ci.length !== 2) return "- / -";
  const lower = Number((ci[0] - eloScore).toFixed(0));
  const upper = Number((ci[1] - eloScore).toFixed(0));
  return `${upper > 0 ? `+${upper}` : upper} / ${lower}`;
};

export function dateFormat(dateTS: number) {
  const date = new Date(dateTS);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset());

  const month = localDate.getMonth() + 1;
  const day = localDate.getDate();
  const hour = localDate.getHours();
  const minute = localDate.getMinutes();

  const monthStr = month >= 10 ? month : "0" + month;
  const dayStr = day >= 10 ? day : "0" + day;
  const hourStr = hour >= 10 ? hour : "0" + hour;
  const minuteStr = minute >= 10 ? minute : "0" + minute;

  return {
    dateFormat: `${localDate.getFullYear()}-${monthStr}-${dayStr} ${hourStr}:${minuteStr}`,
    mobileDateFormat: `${monthStr}-${dayStr} ${hourStr}:${minuteStr}`,
    mobileMypageFormat: `${localDate.getFullYear()}.${monthStr}.${dayStr}`,
    myPageDateFormat: `${localDate.getFullYear()}.${monthStr}.${dayStr} ${hourStr}:${minuteStr}`,
  };
}
