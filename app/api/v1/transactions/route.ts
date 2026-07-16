export async function GET() {
  return Response.json({
    transactions: [
      {
        id: '1',
        merchant_name: 'Best Buy',
        amount: -89.99,
        currency: 'USD',
        transaction_type: 'purchase',
        transaction_date: new Date().toISOString(),
      },
    ],
    total: 1,
    limit: 50,
    offset: 0,
  });
}
