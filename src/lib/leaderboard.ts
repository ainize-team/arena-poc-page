"use server";

type DashboardResponse = {
  [index: string]: {
    model_name: string,
    elo_score: number,
    "95%_CI": Array<number>,
    votes: number,
  }
}

type DashboardTableData = {
  key: number,
  rank: number | "-",
  ci: string,
  elo: number | "-",
  modelName: string,
  votes: number,
}

export const getLeaderboard = async (): Promise<DashboardTableData[]> => {
  const endpoint = `${process.env.SERVER_URL}/dashboard`;
  const res = await fetch(endpoint, {cache: "no-cache"});
  const dashboard = await res.json();

  return dashboardToTableData(dashboard);
}

const dashboardToTableData = (dashboardData: DashboardResponse) => {
  const tableData: DashboardTableData[] = []; 
  for (const [index, datas] of Object.entries(dashboardData)) {
    const numIndex = Number(index);
    const ci = datas["95%_CI"];
    const data: DashboardTableData = {
      key: numIndex,
      rank: datas.votes < 100 ? "-" : numIndex,
      ci: datas.votes < 100 ? "- / -" : stringifyCI(datas.elo_score, ci),
      elo: datas.votes < 100 ? "-" : datas.elo_score,
      modelName: datas.model_name,
      votes: datas.votes,
    } 
    tableData.push(data);
  }
  return tableData
}

const stringifyCI = (eloScore: number, ci: Array<number>): string => {
  if (ci.length !== 2) return "- / -";
  const lower = Number(ci[0].toFixed(0)) - eloScore;
  const upper = Number(ci[1].toFixed(0)) - eloScore;
  return `${upper > 0 ? `+${upper}` : upper} / ${lower}`;
}
