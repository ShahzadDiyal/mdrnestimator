'use client';
// Block editor for custom pages: heading, paragraph, image, list, quote, CTA.
import { Field, Input, Textarea, Select, Btn } from '@/components/admin/ui';
import { IconPlus, IconTrash, IconArrowLeft } from '@/components/admin/icons';

export const BLOCK_TYPES = [
  { value: 'heading', label: 'Heading' },
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'image', label: 'Image' },
  { value: 'list', label: 'Bullet list' },
  { value: 'quote', label: 'Quote' },
  { value: 'cta', label: 'Call to action' },
];

const uid = () => `b${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;

function BlockFields({ block, onChange }) {
  const set = (key) => (e) => onChange({ ...block, [key]: e.target.value });

  switch (block.type) {
    case 'heading':
      return (
        <Field label="Heading text">
          <Input value={block.text || ''} onChange={set('text')} placeholder="Section heading" />
        </Field>
      );
    case 'image':
      return (
        <>
          <Field label="Image URL">
            <Input value={block.imageUrl || ''} onChange={set('imageUrl')} placeholder="https://…" />
          </Field>
          <Field label="Caption / alt text">
            <Input value={block.alt || ''} onChange={set('alt')} placeholder="Describe the image" />
          </Field>
        </>
      );
    case 'list':
      return (
        <Field label="Items" hint="One item per line.">
          <Textarea rows={4} value={block.text || ''} onChange={set('text')} placeholder={'First item\nSecond item'} />
        </Field>
      );
    case 'quote':
      return (
        <>
          <Field label="Quote">
            <Textarea rows={3} value={block.text || ''} onChange={set('text')} placeholder="The quote…" />
          </Field>
          <Field label="Author">
            <Input value={block.author || ''} onChange={set('author')} placeholder="Who said it" />
          </Field>
        </>
      );
    case 'cta':
      return (
        <>
          <Field label="CTA heading">
            <Input value={block.text || ''} onChange={set('text')} placeholder="Ready to get started?" />
          </Field>
          <Field label="CTA subtext">
            <Input value={block.author || ''} onChange={set('author')} placeholder="Short supporting line" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Button label">
              <Input value={block.buttonLabel || ''} onChange={set('buttonLabel')} placeholder="Get a free quote" />
            </Field>
            <Field label="Button link">
              <Input value={block.buttonHref || ''} onChange={set('buttonHref')} placeholder="/contact" />
            </Field>
          </div>
        </>
      );
    case 'paragraph':
    default:
      return (
        <Field label="Paragraph">
          <Textarea rows={4} value={block.text || ''} onChange={set('text')} placeholder="Write the paragraph…" />
        </Field>
      );
  }
}

export default function BlockEditor({ blocks, onChange }) {
  const list = Array.isArray(blocks) ? blocks : [];

  const update = (idx, block) => onChange(list.map((b, i) => (i === idx ? block : b)));
  const remove = (idx) => onChange(list.filter((_, i) => i !== idx));
  const move = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };
  const add = () => onChange([...list, { id: uid(), type: 'paragraph', text: '' }]);

  return (
    <div className="space-y-4">
      {list.map((block, idx) => (
        <div key={block.id || idx} className="rounded-xl border border-ink-900/10 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <Select
              value={block.type}
              onChange={(e) => update(idx, { ...block, type: e.target.value })}
              className="!w-auto"
            >
              {BLOCK_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </Select>
            <div className="ml-auto flex items-center gap-1">
              <Btn variant="ghost" onClick={() => move(idx, -1)} disabled={idx === 0} title="Move up" aria-label="Move up">
                <IconArrowLeft size={14} className="rotate-90" />
              </Btn>
              <Btn variant="ghost" onClick={() => move(idx, 1)} disabled={idx === list.length - 1} title="Move down" aria-label="Move down">
                <IconArrowLeft size={14} className="-rotate-90" />
              </Btn>
              <Btn variant="ghost" onClick={() => remove(idx)} title="Delete block" aria-label="Delete block">
                <IconTrash size={14} />
              </Btn>
            </div>
          </div>
          <BlockFields block={block} onChange={(b) => update(idx, b)} />
        </div>
      ))}
      {list.length === 0 && (
        <p className="rounded-xl border border-dashed border-ink-900/15 px-4 py-8 text-center text-sm text-ink-400">
          No content blocks yet — add the first one below.
        </p>
      )}
      <Btn variant="secondary" onClick={add}>
        <IconPlus size={15} /> Add content block
      </Btn>
    </div>
  );
}
