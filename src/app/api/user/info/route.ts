import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const endpoint = `${process.env.SERVER_URL}/user/me/info`;
    const accessToken = req.cookies.get("access_token")?.value;

    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Cookie: `access_token=${accessToken};`,
        "x-api-key": process.env.SERVER_API_KEY!,
      },
      cache: "no-cache",
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.log("errorData : user/me/info >> ", errorData);
      return Response.json(errorData, {
        status: res.status,
      });
    }

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
