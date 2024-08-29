import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const endpoint = `${process.env.SERVER_URL}/user/me/info`;
    const accessToken = req.cookies.get("access_token");
    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Cookie: `access_token=${accessToken?.value};`,
        "x-api-key": process.env.SERVER_API_KEY!,
      },
      cache: "no-cache",
    });

    const resData = await res.json();
    console.log("resData :>> ", resData);
    return Response.json(resData, {
      status: 200,
    });
  } catch (error) {
    console.log("error :>> ", error);
    return Response.json("", {
      status: 500,
    });
  }
}
