import { NextRequest } from "next/server";

export type ClaimResponse = {
  tx_hash: string;
  amount: number;
};

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();
    const endpoint = `${process.env.SERVER_URL}/user/claim`;
    const accessToken = req.cookies.get("access_token")?.value;
    const body = {
      amount,
    };
    const params = {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-type": "application/json;",
        Cookie: `access_token=${accessToken};`,
        "x-api-key": process.env.SERVER_API_KEY!,
      },
    };

    const res = await fetch(endpoint, params);

    if (!res.ok) {
      const errorData = await res.json();
      console.log("errorData : claim_ain >> ", errorData);
      return Response.json(errorData, {
        status: res.status,
      });
    }

    const resData: ClaimResponse = await res.json();
    console.log("resData : claim_ain >> ", resData);
    return Response.json(resData, {
      status: 200,
    });
  } catch (error) {
    console.log("error : claim_ain >> ", error);
    return Response.json(
      { message: "Internal Server Error" },
      {
        status: 500,
      },
    );
  }
}
