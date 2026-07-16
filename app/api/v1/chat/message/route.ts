export async function POST() {
  return Response.json({
    conversation_id: 'conv-123',
    role: 'assistant',
    content: 'This transaction appears to be legitimate. Best Buy is a trusted retailer you\'ve shopped with before.',
    tokens_used: 150,
  });
}
