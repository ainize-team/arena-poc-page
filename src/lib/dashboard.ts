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
  rank: number,
  elo: number,
  modelName: string,
  votes: number,
}

export const getDashboard = async (): Promise<DashboardTableData[]> => {
  const endpoint = `${process.env.SERVER_URL}/dashboard`;
  const res = await fetch(endpoint, {cache: "no-cache"});
  const dashboard = await res.json();

  return dashboardToTableData(dashboard);
}

const dashboardToTableData = (dashboardData: DashboardResponse) => {
  const tableData: DashboardTableData[] = []; 
  for (const [index, datas] of Object.entries(dashboardData)) {
    const numIndex = Number(index)
    const data: DashboardTableData = {
      key: numIndex,
      rank: numIndex,
      elo: datas.elo_score,
      modelName: datas.model_name,
      votes: datas.votes,
    } 
    tableData.push(data);
  }
  return tableData
}