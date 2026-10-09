// Renders admin-built custom page blocks with the site's standard styling.
export default function CustomPageBlocks({ blocks }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <div className="space-y-8">
      {blocks.map((b, i) => {
        const key = b.id || i;
        switch (b.type) {
          case 'heading':
            return (
              <h2 key={key} className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-900">
                {b.text}
              </h2>
            );
          case 'image':
            return b.imageUrl ? (
              <figure key={key}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.imageUrl}
                  alt={b.alt || ''}
                  className="w-full rounded-2xl shadow-card"
                  loading="lazy"
                />
                {b.alt && (
                  <figcaption className="mt-2 text-center text-sm text-ink-500">{b.alt}</figcaption>
                )}
              </figure>
            ) : null;
          case 'list': {
            const items = String(b.text || '')
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean);
            return (
              <ul key={key} className="space-y-2.5">
                {items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-ink-700">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent-500" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          }
          case 'quote':
            return (
              <blockquote key={key} className="rounded-2xl bg-brand-50/60 border-l-4 border-accent-500 px-6 py-5">
                <p className="text-lg italic text-ink-800">&ldquo;{b.text}&rdquo;</p>
                {b.author && <cite className="mt-2 block text-sm font-semibold text-ink-500 not-italic">— {b.author}</cite>}
              </blockquote>
            );
          case 'cta':
            return (
              <div key={key} className="rounded-2xl bg-gradient-to-br from-brand-800 to-ink-900 px-6 py-10 text-center sm:px-10">
                {b.text && <h3 className="text-2xl font-bold text-white">{b.text}</h3>}
                {b.author && <p className="mt-2 text-white/70">{b.author}</p>}
                {b.buttonLabel && (
                  <a
                    href={b.buttonHref || '/contact'}
                    className="mt-6 inline-block rounded-xl bg-accent-500 px-7 py-3 font-semibold text-white transition hover:bg-accent-600"
                  >
                    {b.buttonLabel}
                  </a>
                )}
              </div>
            );
          case 'paragraph':
          default:
            return (
              <p key={key} className="text-ink-700 leading-relaxed whitespace-pre-line">
                {b.text}
              </p>
            );
        }
      })}
    </div>
  );
}
