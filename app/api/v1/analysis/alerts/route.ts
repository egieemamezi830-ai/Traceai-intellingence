export async function GET() {
  return Response.json({
    alerts: [],
    stats: {
      high_risk: 0,
      medium_risk: 2,
      low_risk: 15,
    },
  });
}
