"use client";

import { Flex, Table, TableProps } from "antd";
import { getLeaderboard } from "@/components/leaderboard";
import { useEffect, useState } from "react";
import { LeaderboardTableData } from "@/type";

export default function Leaderboard() {
  const [lastUpdated, setLastUpdated] = useState("");
  const [tableSourceData, setTableSourceData] = useState<LeaderboardTableData[]>();
  const columns: TableProps["columns"] = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
    }, {
      title: "Model Name",
      dataIndex: "modelName",
      key: "modelName",
      render: (text, record) => <a style={{color:"blue", textDecoration: "underline"}} href={record.link}>{text}</a>
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
    }, {
      title: "Organization",
      dataIndex: "org",
      key: "org",
    }, {
      title: "License",
      dataIndex: "license",
      key: "license",
    }
  ]

  useEffect(() => {
    const setupLeaderboard = async () => {
      const { lastUpdated, tableData } = await getLeaderboard();
      setLastUpdated(lastUpdated);
      setTableSourceData(tableData);
    }
    setupLeaderboard();
  }, [])

  return (
    <div>
      <Flex  style={{
        width: "100%", 
        marginTop: "6px",
        paddingInline: "3rem",
      }} justify="center">
        <Table style={{width: "100%"}} dataSource={tableSourceData} columns={columns}/>
      </Flex>
      <Flex style={{
        width: "100%",
        paddingInline: "3rem",
      }} justify="end">
        <span style={{marginRight: "3px"}}>Last Updated: {lastUpdated}</span>
      </Flex>
    </div>
  )
}
