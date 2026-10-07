import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const INITIAL_POSTS = [
  {
    id: 'post-1',
    title: 'How to Read a Quantity Takeoff Like a Pro',
    slug: 'how-to-read-quantity-takeoff',
    category: 'Guides',
    author: 'Mike Carter',
    readTime: '6 min read',
    date: '2026-09-18',
    featuredImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'CSI divisions, waste factors and markups — a practical walkthrough for GCs reviewing their first takeoff.',
    content: `## Understanding CSI MasterFormat
A professional quantity takeoff is organized by CSI MasterFormat divisions, standardizing line items across all construction trades from Division 03 (Concrete) through Division 33 (Utilities).

### Key Takeoff Elements
1. **Gross vs Net Quantities**: Always verify whether waste factors (typically 5% to 10%) are factored directly into the line item counts.
2. **Unit Rates & Labor Hours**: Break down material unit costs separately from crew productivity rates for maximum bid clarity.
3. **Scope Clarifications**: Pay close attention to notes on exclusions or scope boundaries to prevent duplicate sub contracts or bid gaps.

### Reviewing Bid Deliverables
When receiving your final Excel workbook and marked-up plans, cross-reference color-coded drawing annotations with line item quantities to verify scale precision and perimeter allowances.`,
    metaTitle: 'How to Read a Quantity Takeoff Like a Pro | Modern Estimator',
    metaDescription: 'Master CSI MasterFormat divisions, waste factors, and material markups with our complete guide for general contractors.',
    tags: 'quantity takeoff, csi divisions, estimation guide, contractor tips',
    status: 'Published',
    order: 1,
    createdAt: '2026-09-18T10:00:00.000Z',
    updatedAt: '2026-09-18T10:00:00.000Z',
  },
  {
    id: 'post-2',
    title: '5 Bid-Day Mistakes That Cost Contractors the Job',
    slug: 'bid-day-mistakes',
    category: 'Bidding',
    author: 'Sarah Jennings',
    readTime: '5 min read',
    date: '2026-09-02',
    featuredImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'From missing alternates to stale pricing — the errors we see most often and how to avoid them on submission day.',
    content: `## Common Pitfalls on Bid Day

Preparing commercial and residential construction bids under high pressure often leads to costly errors. Avoid these five critical mistakes:

1. **Ignoring Addenda and Clarifications**: Failing to verify final addenda notes can omit entire scope revisions.
2. **Outdated Regional Pricing**: Labor rates and raw material indices fluctuate monthly; relying on quarterly historical data cuts into gross profit margins.
3. **Overlooking Alternates & Allowances**: Clients often score bids based on mandatory alternate quotes.
4. **Incomplete Sub-Leveling**: Comparing subcontractor quotes without leveling scope exclusions leads to surprise costs post-award.
5. **Rushing Final Submissions**: Double-check math summaries and CSI roll-ups at least two hours before the bid box closes.`,
    metaTitle: '5 Bid-Day Mistakes That Cost Contractors | Modern Estimator',
    metaDescription: 'Avoid missing alternates, stale supplier prices, and leveling errors on construction bid day.',
    tags: 'bid prep, construction mistakes, estimating tips, bidding strategy',
    status: 'Published',
    order: 2,
    createdAt: '2026-09-02T10:00:00.000Z',
    updatedAt: '2026-09-02T10:00:00.000Z',
  },
  {
    id: 'post-3',
    title: 'Residential vs Commercial Estimating: What Changes?',
    slug: 'residential-vs-commercial-estimating',
    category: 'Guides',
    author: 'David Osei',
    readTime: '8 min read',
    date: '2026-09-28',
    featuredImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Scope depth, pricing sources and deliverables — how the two workflows differ in practice and software integration.',
    content: `## Comparing Residential and Commercial Workflows

While both estimating disciplines demand high accuracy, commercial projects introduce complex regulatory standards and rigid breakdown structures.

### Key Differences
- **Coding Standards**: Commercial projects mandate 48-division CSI MasterFormat, whereas residential estimates frequently group by room or trades (Framing, Plumbing, Drywall).
- **Subcontractor Management**: Commercial estimators perform rigorous bid leveling across multi-discipline sub-tier contractors.
- **Prevailing Wage & Union Compliance**: Commercial bids often incorporate Davis-Bacon or prevailing wage labor rates, which do not apply to private residential builds.`,
    metaTitle: 'Residential vs Commercial Estimating Comparison | Modern Estimator',
    metaDescription: 'Discover how scope depth, CSI divisions, and pricing databases vary between residential and commercial estimating.',
    tags: 'residential estimating, commercial takeoff, construction comparison',
    status: 'Draft',
    order: 3,
    createdAt: '2026-09-28T10:00:00.000Z',
    updatedAt: '2026-09-28T10:00:00.000Z',
  },
];

export async function GET() {
  try {
    const postsRef = collection(db, 'posts');
    const snapshot = await getDocs(postsRef);

    let posts = snapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));

    if (posts.length === 0) {
      console.log('Seeding initial blog posts into Firestore DB...');
      for (const item of INITIAL_POSTS) {
        await setDoc(doc(db, 'posts', item.id), item);
      }
      posts = INITIAL_POSTS;
    }

    posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      category,
      author,
      readTime,
      date,
      featuredImage,
      excerpt,
      content,
      metaTitle,
      metaDescription,
      tags,
      status,
      order,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Post title is required' }, { status: 400 });
    }

    const postId = body.id || `post-${Date.now().toString(36)}`;
    const finalSlug = (slug && slug.trim()) || title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/[\s_]+/g, '-');

    const newPost = {
      id: postId,
      title: title.trim(),
      slug: finalSlug,
      category: category ? category.trim() : 'Guides',
      author: author ? author.trim() : 'Modern Estimator Team',
      readTime: readTime ? readTime.trim() : '5 min read',
      date: date || new Date().toISOString().slice(0, 10),
      featuredImage: featuredImage ? featuredImage.trim() : '',
      excerpt: excerpt ? excerpt.trim() : '',
      content: content ? content.trim() : '',
      metaTitle: metaTitle ? metaTitle.trim() : '',
      metaDescription: metaDescription ? metaDescription.trim() : '',
      tags: tags ? tags.trim() : '',
      status: status || 'Draft',
      order: Number(order) || 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'posts', postId), newPost);

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post', details: error.message }, { status: 500 });
  }
}
