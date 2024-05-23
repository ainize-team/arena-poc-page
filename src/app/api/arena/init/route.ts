import { getPickedModels } from "@/app/api/arena/arena";

export async function GET() {
  try {
    const result = await getPickedModels();
    console.debug('Picked :>> ', result);
    return Response.json(result, {
      status: 200,
    })
  } catch (error) {
    return Response.json("", {
      status: 500,
    });
  }
}