"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Spin } from "antd";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { LeaderboardTableData } from "@/src/types/type";
import { getLeaderboard } from "@/src/components/leaderboard";
import { LoadingOutlined } from "@ant-design/icons";
import { cn } from "../utils/cn";

import ChevronLeft from "@/public/images/buttons/ChevronLeft.svg";
import ChevronRight from "@/public/images/buttons/ChevronRight.svg";

type LastUpdatedData = {
  dateFormat: string;
  mobileDateFormat: string;
};

export default function Leaderboard() {
  const router = useRouter();
  const [lastUpdated, setLastUpdated] = useState<LastUpdatedData>();
  const [tableSourceData, setTableSourceData] =
    useState<LeaderboardTableData[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setupLeaderboard = async () => {
      setIsLoading(true);
      const { lastUpdated, tableData } = await getLeaderboard();
      setLastUpdated(lastUpdated);
      setTableSourceData(tableData);
      setIsLoading(false);
    };
    setupLeaderboard();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "rank",
        header: "Rank",
      },
      {
        accessorKey: "modelName",
        header: "Model Name",
        cell: ({ row, getValue }) => (
          <Link
            href={row.original.link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "text-sm font-semibold leading-5 text-blue underline",
            )}
          >
            {getValue()}
          </Link>
        ),
      },
      {
        accessorKey: "elo",
        header: "Arena Score",
      },
      {
        accessorKey: "ci",
        header: "95% CI",
      },
      {
        accessorKey: "votes",
        header: "Vote",
      },
      {
        accessorKey: "org",
        header: "Organization",
      },
      {
        accessorKey: "license",
        header: "License",
      },
    ],
    [],
  );

  const table = useReactTable({
    data: tableSourceData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="max-desktop:px-4 min-desktop:px-0">
      <div className="flex justify-between">
        <span className="text-sm font-semibold leading-130 -tracking-[0.42px] text-light-t3 dark:text-dark-t3">
          Ranking update every 30 minutes
        </span>
        <span className="text-sm font-semibold leading-130 -tracking-[0.42px] text-light-t3 max-desktop:hidden dark:text-dark-t3">
          {lastUpdated?.dateFormat
            ? `Last Updated: ${lastUpdated?.dateFormat}`
            : ""}
        </span>
        <span className="text-sm font-semibold leading-130 -tracking-[0.42px] text-light-t3 min-desktop:hidden dark:text-dark-t3">
          {lastUpdated?.mobileDateFormat}
        </span>
      </div>
      <div className="flex flex-col items-start self-stretch py-[14px]">
        <div className="relative w-full overflow-x-auto rounded-xl border border-light-l2 bg-light dark:border-transparent dark:bg-dark-b2">
          {(isLoading || table.getRowModel().rows.length === 0) && (
            <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-xl bg-light/50">
              {isLoading ? (
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{ fontSize: 64 }}
                      className="text-dark dark:text-light"
                      spin
                    />
                  }
                />
              ) : (
                <div className="text-xl font-semibold leading-5 text-dark">
                  No data available
                </div>
              )}
            </div>
          )}
          <>
            <table className="min-w-full items-start">
              <thead className="bg-light-b3 dark:bg-dark-b3">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="border-b border-b-light-l2 text-left text-sm font-semibold leading-130 -tracking-[0.42px] text-light-t2 dark:border-transparent dark:text-dark-t2"
                  >
                    {headerGroup.headers.map((header, index) => (
                      <th
                        key={header.id}
                        className={cn(
                          "whitespace-nowrap max-mobile:px-[10px] max-mobile:py-[14px] min-mobile:px-[14px] min-mobile:py-4",
                          index === 0 && "text-center",
                        )}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-b-light-l2 text-left text-sm font-semibold leading-5 text-dark dark:border-transparent dark:text-light"
                    >
                      {row.getVisibleCells().map((cell, index) => (
                        <td
                          key={cell.id}
                          className={cn(
                            "whitespace-nowrap max-mobile:px-[10px] max-mobile:py-[14px] min-mobile:px-[14px] min-mobile:py-4",
                            index === 0 && "text-center text-base",
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr className="">
                    <td colSpan={columns.length} className="text-center">
                      <div className="flex h-full items-center justify-center max-desktop:min-h-[300px] min-desktop:min-h-[500px]"></div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="sticky left-0 flex w-full justify-center gap-1 justify-self-end px-6 py-4">
              <button
                onClick={() => table.previousPage()}
                disabled={
                  isLoading ||
                  table.getRowModel().rows.length === 0 ||
                  !table.getCanPreviousPage()
                }
                className="cursor-pointer rounded px-2 py-1 hover:bg-light-b1 hover:shadow-hover disabled:bg-transparent disabled:opacity-50 disabled:shadow-none dark:hover:bg-dark-b3 dark:hover:shadow-hover-dark"
              >
                <Image
                  width={16}
                  height={16}
                  className=""
                  alt={"chatbot arena llm leaderboard ChevronLeft"}
                  src={ChevronLeft}
                />
              </button>
              <button
                onClick={() =>
                  table.setPageIndex(table.getState().pagination.pageIndex)
                }
                className="h-8 w-8 cursor-pointer rounded px-2 py-1 text-base font-bold leading-5 text-dark hover:bg-light-b1 hover:shadow-hover disabled:bg-transparent disabled:opacity-50 disabled:shadow-none dark:text-light dark:hover:bg-dark-b3 dark:hover:shadow-hover-dark"
                disabled={isLoading || tableSourceData?.length === 0}
              >
                {table.getState().pagination.pageIndex + 1}
              </button>
              {table.getCanNextPage() && (
                <>
                  <button
                    onClick={() =>
                      table.setPageIndex(
                        table.getState().pagination.pageIndex + 1,
                      )
                    }
                    disabled={
                      isLoading ||
                      table.getRowModel().rows.length === 0 ||
                      table.getState().pagination.pageIndex + 1 >=
                        table.getPageCount()
                    }
                    className="h-8 w-8 cursor-pointer rounded px-2 py-1 text-base font-normal leading-5 text-light-t3 hover:bg-light-b1 hover:text-dark hover:shadow-hover disabled:bg-transparent disabled:opacity-50 disabled:shadow-none dark:text-dark-t3 dark:hover:bg-dark-b3 dark:hover:text-light dark:hover:shadow-hover-dark"
                  >
                    {table.getState().pagination.pageIndex + 2}
                  </button>
                </>
              )}
              <button
                onClick={() => table.nextPage()}
                disabled={
                  isLoading ||
                  table.getRowModel().rows.length === 0 ||
                  !table.getCanNextPage()
                }
                className="cursor-pointer rounded px-2 py-1 hover:bg-light-b1 hover:shadow-hover disabled:bg-transparent disabled:opacity-50 disabled:shadow-none dark:hover:bg-dark-b3 dark:hover:shadow-hover-dark"
              >
                <Image
                  width={16}
                  height={16}
                  className=""
                  alt={"chatbot arena llm leaderboard ChevronRight"}
                  src={ChevronRight}
                />
              </button>
            </div>
          </>
        </div>
      </div>
    </div>
  );
}
