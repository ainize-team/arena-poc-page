"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { modalState, themeAtom, userInfoState } from "../lib/recoil";
import InProgressBox from "../components/inProgressBox";
import UserProfileImage from "../components/userProfileImage";
import { cn } from "../utils/cn";
import UserExpBar from "../components/userExpBar";
import {
  isDesktopBrowser,
  parseUserExp,
  processNumber,
  rewardPerTier,
} from "../constant/constant";
import {
  ClaimStatus,
  CreditHistoriesResponse,
  CreditHistoriesTableData,
  HistoryStatus,
  UserInfo,
} from "../types/type";
import ClaimModal from "../components/claimModal";
import { dateFormat } from "../components/leaderboard";
import useAuth from "../lib/auth";

import DownloadIcon from "@/public/images/buttons/DownloadIcon.svg";
import DownloadIconDark from "@/public/images/buttons/DownloadIconDark.svg";
import ChevronLeft from "@/public/images/buttons/ChevronLeft.svg";
import ChevronRight from "@/public/images/buttons/ChevronRight.svg";
import NoticeIcon from "@/public/images/buttons/NoticeIcon.svg";
import NoticeIconDark from "@/public/images/buttons/NoticeIconDark.svg";

type PaginationParam = {
  last_doc_id: string | null;
  count: number;
};

interface MypageProps {
  userInfo: UserInfo;
  getInfo: () => Promise<void>;
}

const defaultPagination: PaginationParam = {
  last_doc_id: "",
  count: 15,
};
export default function Mypage({ userInfo, getInfo }: MypageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { authFetch } = useAuth();

  const [recoilUserInfoState, setUserInfo] = useRecoilState(userInfoState);
  const [theme, setTheme] = useRecoilState(themeAtom);
  const [isOpen, setIsOpen] = useRecoilState(modalState);

  const [userExpPercentage, setUserExpPercentage] = useState(0);
  const [currentTheme, setCurrentTheme] = useState("light");
  const [tableSourceData, setTableSourceData] = useState<
    CreditHistoriesTableData[]
  >([]);
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>(
    ClaimStatus.NOTCONNECTED,
  );
  const [initialLoading, setInitialLoading] = useState(false);
  const [pagination, setPagination] =
    useState<PaginationParam>(defaultPagination);
  const [pageIndex, setPageIndex] = useState(0);

  const getInitialHistories = async (pagination: PaginationParam) => {
    setInitialLoading(true);
    if (!session) {
      return;
    }
    try {
      const { last_doc_id, count } = pagination;
      const res = await authFetch(
        `/api/user/credit_histories?count=${count}${last_doc_id ? `&last_doc_id=${last_doc_id}` : ""}`,
        { method: "GET" },
      );
      const { histories } = await res.json();
      if (res.status === 200) {
        historiesToTableData(histories);
      }
    } catch (error) {}
    setInitialLoading(false);
  };

  const getHistoriesAPI = async (pagination: PaginationParam) => {
    if (!session) {
      return;
    }
    try {
      const { last_doc_id, count } = pagination;
      const res = await authFetch(
        `/api/user/credit_histories?count=${count}${last_doc_id ? `&last_doc_id=${last_doc_id}` : ""}`,
        { method: "GET" },
      );
      const { histories } = await res.json();
      if (res.status === 200) {
        historiesToTableData(histories);
      }
    } catch (error) {}
  };

  const loadMoreHistories = () => {
    if (tableSourceData.length > 0) {
      const lastDocId = tableSourceData[tableSourceData.length - 1].id;
      setPagination({ ...pagination, last_doc_id: lastDocId });
    }
  };

  useEffect(() => {
    checkTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (
      claimStatus === ClaimStatus.SUCCESS ||
      claimStatus === ClaimStatus.FAILURE
    ) {
      getInfo();
      setTableSourceData([]);
      setPagination(defaultPagination);
      setPageIndex(0);
    }
  }, [claimStatus]);

  useEffect(() => {
    if (userInfo) {
      const userExpPercentage = parseUserExp(userInfo.tier, userInfo.exp);
      setUserExpPercentage(userExpPercentage);
      if (userInfo.address && !isOpen) {
        setClaimStatus(ClaimStatus.READY);
      }
      getInitialHistories(pagination);
    }
  }, [userInfo]);

  useEffect(() => {
    if (!pagination.last_doc_id) {
      return;
    }
    if (userInfo) {
      if (
        claimStatus === ClaimStatus.SUCCESS ||
        claimStatus === ClaimStatus.FAILURE
      ) {
        getHistoriesAPI(defaultPagination);
      } else {
        getHistoriesAPI(pagination);
      }
    }
  }, [pagination, userInfo]);

  useEffect(() => {
    if (pageIndex + 2 >= table.getPageCount()) {
      loadMoreHistories();
    }
  }, [pageIndex]);

  const checkTheme = (theme: string) => {
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setCurrentTheme(systemTheme);
    } else {
      setCurrentTheme(theme);
    }
  };

  const openModal = () => {
    if (!isDesktopBrowser()) {
      setClaimStatus(ClaimStatus.NOTSUPPORTED);
    } else {
      if (userInfo.address) {
        setClaimStatus(ClaimStatus.READY);
      } else {
        setClaimStatus(ClaimStatus.NOTCONNECTED);
      }
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const getTierTextColor = (tier: number): string => {
    let textColor = "text-light-tier0Text dark:text-dark-tier0DarkText";

    switch (tier) {
      case 1:
        textColor = "text-light-tier1Text  dark:text-dark-tier1DarkText";
        break;
      case 2:
        textColor = "text-light-tier2Text dark:text-dark-tier2DarkText";
        break;
      case 3:
        textColor = "text-light-tier3Text dark:text-dark-tier3DarkText";
        break;
      case 4:
        textColor = "text-light-tier4Text dark:text-dark-tier4DarkText";
        break;
      case 5:
        textColor = "text-light-tier5Text dark:text-dark-tier5DarkText";
        break;
      default:
        textColor = "text-light-tier0Text dark:text-dark-tier0DarkText";
        break;
    }

    return textColor;
  };

  const getTierBgColor = (tier: number): string => {
    let bgColor = "bg-light-tier0Bg dark:bg-dark-tier0DarkText";

    switch (tier) {
      case 1:
        bgColor = "bg-light-tier1Bg  dark:bg-dark-tier1DarkBg";
        break;
      case 2:
        bgColor = "bg-light-tier2Bg dark:bg-dark-tier2DarkBg";
        break;
      case 3:
        bgColor = "bg-light-tier3Bg dark:bg-dark-tier3DarkBg";
        break;
      case 4:
        bgColor = "bg-light-tier4Bg dark:bg-dark-tier4DarkBg";
        break;
      case 5:
        bgColor = "bg-light-tier5Bg dark:bg-dark-tier5DarkBg";
        break;
      default:
        bgColor = "bg-light-tier0Bg dark:bg-dark-tier0DarkBg";
        break;
    }

    return bgColor;
  };

  const columns: ColumnDef<CreditHistoriesTableData>[] = useMemo(
    () => [
      {
        accessorKey: "created_at",
        header: "created_at",
        cell: ({ row, getValue }) => {
          const createdAt = getValue() as string;
          const createdTs = Date.parse(createdAt);
          const localeDate = dateFormat(createdTs);

          return (
            <>
              <div className="flex min-w-36 flex-row items-center self-stretch text-base font-medium leading-5 text-dark-t3 max-desktop:hidden dark:text-dark-t2">
                {localeDate.myPageDateFormat}
              </div>
              <div className="flex flex-row items-center self-stretch text-sm font-medium leading-5 text-dark-t3 min-desktop:hidden dark:text-dark-t2">
                {localeDate.mobileMypageFormat}
              </div>
            </>
          );
        },
      },
      {
        accessorKey: "status",
        header: "status",
        cell: ({ row, getValue }) => {
          const statusValue = getValue() as HistoryStatus;
          return statusValue === HistoryStatus.CLAIM ? (
            <div className="flex flex-row items-center gap-4 self-stretch">
              <div className="flex flex-col gap-1 self-stretch text-left">
                <div className="font-semibold leading-5 text-dark max-desktop:text-sm min-desktop:text-base dark:text-light">
                  Claim
                </div>
                <div className="font-semibold leading-5 text-dark max-desktop:text-sm min-desktop:text-base dark:text-light">
                  Transfer Fee
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-row items-center gap-4 self-stretch">
              <div className="font-semibold leading-5 text-dark max-desktop:text-sm min-desktop:text-base dark:text-light">
                Reward
              </div>
              <div
                className={cn(
                  "flex items-center justify-center rounded-[4px] p-1 text-center text-xs font-bold leading-120",
                  getTierBgColor(row.original.info.user_tier ?? 0),
                  getTierTextColor(row.original.info.user_tier ?? 0),
                )}
              >
                Tier {row.original.info.user_tier ?? 0}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "amount",
        cell: ({ row, getValue }) => {
          const amountValue = getValue() as number;
          const formattedAmount = processNumber(amountValue);
          return row.original.status === HistoryStatus.CLAIM ? (
            <div className="flex flex-col self-stretch font-bold leading-5 text-dark max-desktop:text-sm min-desktop:text-base dark:text-light">
              <div>- {formattedAmount} AIN</div>
              <div>- {row.original.info.tx_fee} AIN</div>
            </div>
          ) : (
            <div className="flex flex-col self-stretch font-bold leading-5 text-dark max-desktop:text-sm min-desktop:text-base dark:text-light">
              {formattedAmount} AIN
            </div>
          );
        },
      },
    ],
    [],
  );

  const historiesToTableData = (modelDatas: CreditHistoriesResponse) => {
    const tableData: CreditHistoriesTableData[] = [];
    for (const [index, datas] of Object.entries(modelDatas)) {
      const numIndex = Number(index);
      const data: any = datas;
      data.key = numIndex;
      tableData.push(data);
    }
    setTableSourceData((prevData) => [...prevData, ...tableData]);
  };

  const table = useReactTable({
    data: tableSourceData.slice(pageIndex * 5, (pageIndex + 1) * 5),
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination: { pageIndex, pageSize: 5 } },
    manualPagination: true,
    pageCount: Math.ceil(tableSourceData.length / 5),
  });

  const navigateToPageWithTab = () => {
    const params = new URLSearchParams({
      tab: "TIER",
    });
    router.push(`/about?${params.toString()}`);
  };

  return userInfo ? (
    <div className="flex gap-6 max-desktop:flex-col max-desktop:px-4 min-desktop:flex-row min-desktop:px-0 min-mobile:mt-7">
      <div className="flex h-full min-w-[300px] flex-col items-center gap-8 self-stretch rounded-xl bg-light-b3 px-5 py-6 dark:bg-dark-b2">
        <div className="flex flex-col items-center gap-4">
          <UserProfileImage
            imageUrl={userInfo.picture}
            width={120}
            height={120}
            hasBadge={true}
            onClick={() => {}}
            userTier={userInfo.tier}
            badgeClassName={cn("bottom-[-9px] right-[-4px]")}
          />
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-semibold leading-120 text-dark dark:text-light">
              {userInfo.display_name}
            </p>
            <p className="text-base font-medium leading-120 text-light-t3 dark:text-dark-t3">
              {userInfo.email}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 self-stretch pb-5">
          <div className="flex w-full flex-col items-center gap-1 px-[10px]">
            <UserExpBar
              className={"h-[13px] w-full rounded-3xl"}
              userExpPercentage={userExpPercentage}
              barWidth={240}
            />
            <div className="flex w-full justify-between">
              <p
                className={cn(
                  "text-sm font-medium leading-120",
                  getTierTextColor(userInfo.tier),
                )}
              >
                Tier {userInfo.tier === undefined ? "" : userInfo.tier}
              </p>
              <p className="text-sm font-medium leading-120 text-light-t3 dark:text-dark-t3">
                EXP {Math.round(userExpPercentage * 100 * 1e1) / 1e1}%
              </p>
              <p
                className={cn(
                  "text-sm font-medium leading-120",
                  getTierTextColor(
                    userInfo.tier === 5 ? userInfo.tier : userInfo.tier + 1,
                  ),
                )}
              >
                Tier{" "}
                {userInfo.tier === undefined
                  ? ""
                  : userInfo.tier === 5
                    ? userInfo.tier
                    : userInfo.tier + 1}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-5 self-stretch rounded-lg bg-light-b2 px-4 py-3 dark:bg-dark-b3">
            <div className="flex flex-col items-start justify-center gap-1">
              <div className="flex items-center gap-2">
                <p className="text-base font-bold leading-120 text-dark dark:text-light">
                  Current
                </p>
                <div
                  className={cn(
                    "flex items-center justify-center rounded-[4px] p-1 text-center text-xs font-bold leading-120",
                    getTierBgColor(userInfo.tier),
                    getTierTextColor(userInfo.tier),
                  )}
                >
                  Tier {userInfo.tier === undefined ? "" : userInfo.tier}
                </div>
              </div>
              <p className="text-sm font-medium leading-120 text-light-t2 dark:text-dark-t2">
                {rewardPerTier(userInfo.tier)}
              </p>
            </div>

            {userInfo.tier === 5 ? (
              <div className="flex items-start gap-1 self-stretch">
                <Image
                  alt="notice icon"
                  width={14}
                  height={14}
                  src={currentTheme === "light" ? NoticeIcon : NoticeIconDark}
                  className="h-5 w-5 p-1"
                />
                <p className="text-left text-sm font-medium leading-120 -tracking-[0.28px] text-light-t2 dark:text-dark-t3">
                  Congratulations on reaching the final tier, Tier 5
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-start justify-center gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold leading-120 text-dark dark:text-light">
                    Next
                  </p>
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-[4px] p-1 text-center text-xs font-bold leading-120",
                      getTierBgColor(userInfo.tier + 1),
                      getTierTextColor(userInfo.tier + 1),
                    )}
                  >
                    Tier {userInfo.tier === undefined ? "" : userInfo.tier + 1}
                  </div>
                </div>
                <p className="text-sm font-medium leading-120 text-light-t2 dark:text-dark-t2">
                  {rewardPerTier(userInfo.tier + 1)}
                </p>
              </div>
            )}

            {/* <div className="flex items-start gap-1 self-stretch">
              <Image
                alt="notice icon"
                width={14}
                height={14}
                src={currentTheme === "light" ? NoticeIcon : NoticeIconDark}
                className="h-5 w-5 p-1"
              />
              <p className="text-left text-sm font-medium leading-120 -tracking-[0.28px] text-light-t2 dark:text-dark-t3">
                Tier drops after 3 days of inactive
              </p>
            </div> */}
          </div>

          <div
            onClick={navigateToPageWithTab}
            className={cn(
              "cursor-pointer text-sm font-medium leading-140 text-light-t2 underline dark:text-dark-t2",
            )}
          >
            How to level up your battle tier
          </div>
        </div>
      </div>
      <div className="flex h-full w-full flex-col items-start gap-6 max-desktop:w-full min-desktop:min-w-[570px] min-desktop:p-6">
        <div className="flex flex-col items-start gap-8 self-stretch">
          <div className="flex flex-col items-start gap-1 self-stretch">
            <div className="text-left text-sm font-medium leading-5 text-light-t2 dark:text-dark-t2">
              Claimable
            </div>
            <div className="flex items-center gap-[10px] self-stretch">
              <p className="font-bold leading-8 text-dark max-desktop:text-2xl min-desktop:text-[32px] dark:text-light">
                {processNumber(userInfo.credit)} AIN
              </p>
              <div
                className="flex h-8 cursor-pointer items-center justify-center gap-1 rounded-lg bg-dark px-3 py-[6px] hover:bg-dark-b3 dark:bg-light hover:dark:bg-light-l2"
                onClick={openModal}
              >
                <Image
                  alt="download icon"
                  width={16}
                  height={16}
                  src={
                    currentTheme === "light" ? DownloadIcon : DownloadIconDark
                  }
                />
                <p className="text-sm font-bold leading-8 -tracking-[0.28px] text-light dark:text-dark">
                  Claim
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-20">
            <div className="flex flex-col items-start gap-1">
              <div className="text-left text-sm font-medium leading-5 text-light-t2 dark:text-dark-t2">
                Claimed
              </div>
              <p className="font-bold leading-8 text-dark max-desktop:text-2xl min-desktop:text-[32px] dark:text-light">
                {processNumber(userInfo.claimed_credit)} AIN
              </p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <div className="text-left text-sm font-medium leading-5 text-light-t2 dark:text-dark-t2">
                Cumulative
              </div>
              <p className="font-bold leading-8 text-dark max-desktop:text-2xl min-desktop:text-[32px] dark:text-light">
                {processNumber(userInfo.credit + userInfo.claimed_credit)} AIN
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex w-full flex-col self-stretch max-desktop:items-start max-desktop:overflow-x-auto min-desktop:items-center">
          {table.getRowModel().rows.length === 0 && (
            <div className="absolute left-0 top-0 flex w-full items-center justify-center rounded-xl bg-light-b1/50 max-desktop:h-[200px] min-desktop:h-[400px] dark:bg-dark/50">
              {initialLoading ? (
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
                  No credit histories
                </div>
              )}
            </div>
          )}
          <>
            <table className="min-w-full items-start">
              <tbody className="flex flex-col items-center self-stretch">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row, index) => (
                    <tr
                      key={row.id}
                      className={cn(
                        "flex h-full flex-row items-center justify-between self-stretch border-b border-b-light-l2 text-left text-sm font-semibold leading-5 text-dark max-desktop:gap-0 min-desktop:gap-[110px] dark:border-transparent dark:border-b-dark-l2 dark:text-light",
                        index === 0 &&
                          "border-t border-t-light-l2 dark:border-t-dark-l2",
                      )}
                    >
                      {row.getVisibleCells().map((cell, index) => (
                        <td
                          key={cell.id}
                          className={cn(
                            "flex-[1_0_0%] whitespace-nowrap text-left max-mobile:px-[0px] max-mobile:py-[14px] min-mobile:px-0 min-mobile:py-[14px]",
                            index === 1 && "ml-4",
                            index === 2 && "text-right text-base",
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
            {table.getRowModel().rows.length > 0 && !initialLoading && (
              <div className="sticky left-0 flex w-full justify-center gap-1 justify-self-end px-6 py-4">
                <button
                  onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={
                    initialLoading ||
                    table.getRowModel().rows.length === 0 ||
                    !table.getCanPreviousPage()
                  }
                  className="cursor-pointer rounded px-2 py-1 hover:bg-light-b1 hover:shadow-hover disabled:bg-transparent disabled:opacity-50 disabled:shadow-none dark:hover:bg-dark-b3 dark:hover:shadow-hover-dark"
                >
                  <Image
                    width={16}
                    height={16}
                    className=""
                    alt={"leaderboard ChevronLeft"}
                    src={ChevronLeft}
                  />
                </button>
                <button
                  onClick={() =>
                    setPageIndex(table.getState().pagination.pageIndex)
                  }
                  className="h-8 w-8 cursor-pointer rounded px-2 py-1 text-base font-bold leading-5 text-dark hover:bg-light-b1 hover:shadow-hover disabled:bg-transparent disabled:opacity-50 disabled:shadow-none dark:text-light dark:hover:bg-dark-b3 dark:hover:shadow-hover-dark"
                  disabled={initialLoading || tableSourceData?.length === 0}
                >
                  {pageIndex + 1}
                </button>

                {pageIndex + 2 <= table.getPageCount() && (
                  <button
                    onClick={() => setPageIndex((prev) => prev + 1)}
                    disabled={
                      initialLoading ||
                      table.getRowModel().rows.length < 5 ||
                      !table.getCanNextPage() ||
                      pageIndex + 1 >= table.getPageCount()
                    }
                    className="h-8 w-8 cursor-pointer rounded px-2 py-1 text-base font-normal leading-5 text-light-t3 hover:bg-light-b1 hover:text-dark hover:shadow-hover disabled:bg-transparent disabled:opacity-50 disabled:shadow-none dark:text-dark-t3 dark:hover:bg-dark-b3 dark:hover:text-light dark:hover:shadow-hover-dark"
                  >
                    {pageIndex + 2}
                  </button>
                )}
                {pageIndex + 3 <= table.getPageCount() && (
                  <button
                    onClick={() => setPageIndex((prev) => prev + 2)}
                    disabled={
                      initialLoading ||
                      table.getRowModel().rows.length === 0 ||
                      pageIndex + 2 >= table.getPageCount()
                    }
                    className="h-8 w-8 cursor-pointer rounded px-2 py-1 text-base font-normal leading-5 text-light-t3 hover:bg-light-b1 hover:text-dark hover:shadow-hover disabled:bg-transparent disabled:opacity-50 disabled:shadow-none dark:text-dark-t3 dark:hover:bg-dark-b3 dark:hover:text-light dark:hover:shadow-hover-dark"
                  >
                    {pageIndex + 3}
                  </button>
                )}
                <button
                  onClick={() =>
                    setPageIndex((prev) =>
                      Math.min(prev + 1, table.getPageCount() - 1),
                    )
                  }
                  disabled={
                    initialLoading ||
                    table.getRowModel().rows.length === 0 ||
                    !table.getCanNextPage()
                  }
                  className="cursor-pointer rounded px-2 py-1 hover:bg-light-b1 hover:shadow-hover disabled:bg-transparent disabled:opacity-50 disabled:shadow-none dark:hover:bg-dark-b3 dark:hover:shadow-hover-dark"
                >
                  <Image
                    width={16}
                    height={16}
                    className=""
                    alt={"leaderboard ChevronRight"}
                    src={ChevronRight}
                  />
                </button>
              </div>
            )}
          </>
        </div>
      </div>
      <ClaimModal
        onCloseFunction={closeModal}
        userInfo={userInfo}
        claimStatus={claimStatus}
        setClaimStatus={setClaimStatus}
      />
    </div>
  ) : (
    <InProgressBox />
  );
}
