import { NextRequest } from "next/server";
import { CreditHistoriesResponse } from "@/src/types/type";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const last_doc_id = searchParams.get("last_doc_id") || null; // 기본값 null
    const count = searchParams.get("count") || "15"; // 기본값 10

    const endpoint = `${process.env.SERVER_URL}/user/me/credit_histories?count=${count}${last_doc_id ? `&last_doc_id=${last_doc_id}` : ""}`;
    const accessToken = req.cookies.get("access_token");

    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Cookie: `access_token=${accessToken?.value};`,
        "x-api-key": process.env.SERVER_API_KEY!,
      },
      cache: "no-cache",
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.log("errorData : credit_histories >> ", errorData);
      return Response.json(errorData, {
        status: res.status,
      });
    }

    const resData: CreditHistoriesResponse = await res.json();
    console.log("resData : credit_histories >> ", resData);
    return Response.json(resData, {
      status: 200,
    });
  } catch (error) {
    console.log("error : credit_histories >> ", error);
    return Response.json(
      { message: "Internal Server Error" },
      {
        status: 500,
      },
    );
  }
}
