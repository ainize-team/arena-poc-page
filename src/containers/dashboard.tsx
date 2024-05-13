import { Table } from "antd";
import { getDashboard } from "@/lib/dashboard";

export default async function Dashboard() {
  const dashboardData = await getDashboard();
  const columns = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
    }, {
      title: "Model Name",
      dataIndex: "modelName",
      key: "modelName",
    }, {
      title: "95% CI",
      dataIndex: "ci",
      key: "ci",
    }, {
      title: "ELO Score",
      dataIndex: "elo",
      key: "elo",
    }, {
      title: "Votes",
      dataIndex: "votes",
      key: "votes",
    },
  ]

  return (
    <div>
      <Table dataSource={dashboardData} columns={columns}/>
    </div>
  )
}
