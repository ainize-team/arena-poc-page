"use client";

import { Flex, Spin, Table, TableProps } from "antd";
import { getLeaderboard } from "@/components/leaderboard";
import { useEffect, useState } from "react";
import { LeaderboardTableData } from "@/type";
import ScoreTooltip from "@/components/scoreTooltip";

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
      title: () => <ScoreTooltip>Arena Score</ScoreTooltip>,
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
      <div style={{
        textAlign: "left",
        display: "flex",
        paddingInline: "3rem",
        marginTop: "16px",
      }}>
        <span style={{flex: "none"}}>Rankings update every 30 minutes.</span>
        <span style={{marginLeft: "auto", color: "rgba(0, 0, 0, .5)"}}>Last Updated: {lastUpdated}</span>
      </div>
      <Flex style={{
        width: "100%", 
        marginTop: "12px",
        paddingInline: "3rem",
      }} justify="center">
        <Table style={{width: "100%"}} dataSource={tableSourceData} columns={columns}/>
      </Flex>
    </div>
  )
}
