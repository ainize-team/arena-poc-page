import { NextRequest } from "next/server";

/**
 * AIN Event 당첨자가 지갑 연결하면 보상량 지급 요청
 * Arena 메인 로직이랑 관계 X
 */

export async function GET(
  req: NextRequest, 
  { params }: { params: { address: string } }
) {
  const { address } = params;
  try {
    if (!address) throw new Error("no address");
    const endpoint = `${process.env.SERVER_URL}/event/user/${address}/reward`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      cache: "no-cache",
    });
    const resData = await res.json();
    return Response.json(resData, {
      status: 200,
    });
  } catch (error) {
    return Response.json("", {
      status: 500,
    });
  }
}