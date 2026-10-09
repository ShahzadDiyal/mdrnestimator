import { getCrawling } from '@/lib/site';

// /llms.txt — served verbatim from Website Content → Crawling & Indexing.
export async function GET() {
  const crawling = await getCrawling().catch(() => null);
  const text = (crawling?.llmsTxt || '# Modern Estimator\n').trim() + '\n';

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
