import { Flex, Table } from "antd";
import { getLeaderboard } from "@/lib/leaderboard";

export default async function Leaderboard() {
  const { lastUpdated, tableData } = await getLeaderboard();
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
      title: "Arena Score",
      dataIndex: "elo",
      key: "elo",
    }, {
      title: "95% CI",
      dataIndex: "ci",
      key: "ci",
    }, {
      title: "Votes",
      dataIndex: "votes",
      key: "votes",
    },
  ]

  return (
    <div>
      <Flex justify="end">
        <span style={{marginRight: "3px"}}>Last Updated: {lastUpdated}</span>
      </Flex>
      <Table dataSource={tableData} columns={columns}/>
    </div>
  )
}
