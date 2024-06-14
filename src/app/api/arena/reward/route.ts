import { getDailyRewardPercentage } from "@/app/api/arena/arena";

export async function GET() {
  try {
    const result = await getDailyRewardPercentage();
    return Response.json(result.percentage, {
      status: 200,
    });
  } catch (error) {
    return Response.json(0, {
      status: 500,
    });
  }
}
