"use server";
const MINIMUM_VOTE = 50;
type DashboardResponse = {
  last_updated: number,
  leader_board: LeaderboardModelData[],
}

type LeaderboardModelData = {
  rank: number,
  model_name: string,
  elo_score: number,
  "95%_CI": Array<number>,
  votes: number,
}

type DashboardTableData = {
  key: number,
  rank: number | "🔥",
  ci: string,
  elo: string,
  modelName: string,
  votes: number,
}

export const getLeaderboard = async () => {
  const endpoint = `${process.env.SERVER_URL}/dashboard`;
  const res = await fetch(endpoint, {cache: "no-cache"});
  const dashboard: DashboardResponse = await res.json();
  // NOTE (yoojin): python timestamp to js timestamp need * 1000
  const lastUpdatedTS = dashboard.last_updated * 1000; 
  const lastUpdatedString = dateFormat(lastUpdatedTS);
  const tableData = dashboardToTableData(dashboard.leader_board);
  return {
    lastUpdated: lastUpdatedString,
    tableData,
  };
}

const dashboardToTableData = (modelDatas: LeaderboardModelData[]) => {
  const tableData: DashboardTableData[] = []; 
  for (const [index, datas] of Object.entries(modelDatas)) {
    const numIndex = Number(index);
    const ci = datas["95%_CI"];
    const data: DashboardTableData = {
      key: numIndex,
      rank: "🔥",
      ci: datas.votes < MINIMUM_VOTE ? "- / -" : stringifyCI(datas.elo_score, ci),
      elo: datas.votes < MINIMUM_VOTE ? "-" : datas.elo_score.toFixed(0),
      modelName: datas.model_name,
      votes: datas.votes,
    } 
    tableData.push(data);
  }
  tableData.sort((a, b) => {
    const eloA = a.elo !== "-" ? a.elo : -999999;
    const eloB = b.elo !== "-" ? b.elo : -999999;
    if (eloA < eloB) return 1;
    return -1;
  });
  let count = 1;
  tableData.forEach((data) => {
    if (data.elo !== "-") data.rank = count++;
  })

  return tableData;
}

const stringifyCI = (eloScore: number, ci: Array<number>): string => {
  if (ci.length !== 2) return "- / -";
  const lower = Number((ci[0] - eloScore).toFixed(0));
  const upper = Number((ci[1] - eloScore).toFixed(0));
  return `${upper > 0 ? `+${upper}` : upper} / ${lower}`;
}

function dateFormat(dateTS: number) {
  const date = new Date(dateTS);

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  const monthStr = month >= 10 ? month : "0" + month;
  const dayStr = day >= 10 ? day : "0" + day;
  const hourStr = hour >= 10 ? hour : "0" + hour;
  const minuteStr = minute >= 10 ? minute : "0" + minute;

  return `${date.getFullYear()}-${monthStr}-${dayStr} ${hourStr}:${minuteStr}`;
}
