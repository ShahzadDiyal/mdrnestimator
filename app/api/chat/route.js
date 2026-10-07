import Anthropic from '@anthropic-ai/sdk';

// The Anthropic SDK needs the Node.js runtime (not edge).
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

const SYSTEM_PROMPT = `You are "Ryan", a friendly estimating specialist for Modern Estimator, a US construction estimation company.

About the business:
- Services: Quantity Takeoff, Material Estimation, Residential Estimation, Commercial Estimation, Bid Preparation, and Trade-Specific Estimates (concrete, drywall, painting, roofing, MEP).
- Turnaround: standard 8–24 hours; larger commercial projects 3–5 business days; rush options available.
- Accuracy: estimates within ±2%, CSI-coded, delivered in Excel + PDF with marked-up plans and an executive summary.
- Coverage: all 50 US states, with regional pricing databases.
- Pricing: most residential takeoffs start at $250 and commercial projects at $500; final price depends on size, scope and timeline. A quote is free with no obligation.
- We respond to quote requests within 2 business hours.
- Contact: phone +1 (555) 123-4567, email hello@modernestimator.com.

Your job:
- Help potential clients understand the services, answer questions about turnaround, pricing, deliverables and coverage, and encourage them to request a free quote.
- Be concise, warm and professional. Keep answers short (2–4 sentences) unless asked for detail. Use plain text — no markdown headings or tables.
- When someone is ready to start, guide them to the "Request a Quote" form on the page or to email/call us.
- If you don't know something specific (exact price for their project, project status), say so honestly and point them to request a quote or contact us. Never invent prices, deadlines, or commitments.
- Stay on topic: construction estimation and this company. Politely redirect unrelated questions.`;

export async function POST(request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'The assistant is not configured yet (missing ANTHROPIC_API_KEY).' }),
      { status: 503, headers: { 'content-type': 'application/json' } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  // Keep only valid, alternating-ish chat turns and cap history length.
  const messages = (Array.isArray(body?.messages) ? body.messages : [])
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0
    )
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content }));

  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    return new Response(JSON.stringify({ error: 'No user message to respond to.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const ms = client.messages.stream({
          model: 'claude-opus-4-8',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          output_config: { effort: 'low' }, // snappy, low-cost replies for a support widget
          messages,
        });

        ms.on('text', (delta) => controller.enqueue(encoder.encode(delta)));
        await ms.finalMessage();
        controller.close();
      } catch (err) {
        console.error('Chat stream error:', err);
        controller.enqueue(
          encoder.encode(
            "\n\nSorry — I ran into a problem. Please try again, or reach us at hello@modernestimator.com."
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
  });
}
