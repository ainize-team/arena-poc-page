import { NextRequest } from "next/server";

type ConnectAinResponse = {
  address: string;
};

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    const endpoint = `${process.env.SERVER_URL}/user/connect/ain`;
    const accessToken = req.cookies.get("access_token")?.value;
    const body = {
      address,
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
      return Response.json(errorData, {
        status: res.status,
      });
    }

    const resData: ConnectAinResponse = await res.json();
    return Response.json(resData, {
      status: 200,
    });
  } catch (error) {
    return Response.json(
      { message: "Internal Server Error" },
      {
        status: 500,
      },
    );
  }
}
