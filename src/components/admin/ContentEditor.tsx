"use client";

import { useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Copy, ExternalLink, Plus, Trash2 } from "lucide-react";
import { humanize } from "@/lib/admin/format";
import { ColorField, FieldShell, TextAreaField, TextField, Toggle } from "./fields";
import { ImageField } from "./media";
import { Button, EmptyState, IconButton, cn } from "./ui";

/* ------------------------------------------------------------------ helpers */

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const isPrimitive = (v: unknown) => typeof v === "string" || typeof v === "number" || typeof v === "boolean";

const IMAGE_KEY = /image|img|photo|bg|background|logo|poster|thumbnail|avatar|src/i;
const IMAGE_EXT = /\.(jpe?g|png|webp|gif|svg|avif)(\?.*)?$/i;
const VIDEO_KEY = /video/i;
const VIDEO_EXT = /\.(mp4|webm)(\?.*)?$/i;
const COLOR_KEY = /hex|colou?r/i;
const HEX_VALUE = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const LINK_KEY = /href|link|url/i;
// Keys that merely describe an image ("logoAlt", "imageCaption") are plain text.
const TEXTY_SUFFIX = /(alt|label|text|title|caption|desc|description|heading|name|subtitle|tag)$/i;

type ScalarKind = "image" | "video" | "color" | "link" | "textarea" | "text";

function looksLikePath(v: string) {
  return v === "" || v.startsWith("/") || /^https?:\/\//i.test(v) || v.startsWith("data:");
}

function scalarKind(key: string, value: string, def: unknown): ScalarKind {
  const sample = typeof def === "string" && def ? def : value;
  if (HEX_VALUE.test(value.trim()) && (COLOR_KEY.test(key) || HEX_VALUE.test(sample))) return "color";
  if (VIDEO_EXT.test(value) || VIDEO_EXT.test(sample) || (VIDEO_KEY.test(key) && !TEXTY_SUFFIX.test(key) && looksLikePath(value))) return "video";
  if (IMAGE_EXT.test(value) || IMAGE_EXT.test(sample)) return "image";
  if (IMAGE_KEY.test(key) && !TEXTY_SUFFIX.test(key) && looksLikePath(value)) return "image";
  if (LINK_KEY.test(key)) return "link";
  const long = (s: unknown) => typeof s === "string" && (s.length > 80 || s.includes("\n"));
  if (long(def) || long(value)) return "textarea";
  return "text";
}

/** A blank copy of an array item: strings emptied, numbers/booleans kept, nested lists emptied. */
export function blankLike(template: unknown): unknown {
  if (typeof template === "string") return "";
  if (typeof template === "number" || typeof template === "boolean") return template;
  if (Array.isArray(template)) return [];
  if (isObj(template)) return Object.fromEntries(Object.entries(template).map(([k, v]) => [k, blankLike(v)]));
  return "";
}

function itemTitle(item: unknown, index: number) {
  if (isObj(item)) {
    for (const k of ["title", "label", "name", "heading", "question", "breadcrumb", "value", "id", "size", "text"]) {
      const v = item[k];
      if ((typeof v === "string" && v.trim()) || typeof v === "number") return String(v);
    }
    const firstString = Object.values(item).find((v) => typeof v === "string" && v.trim() && !IMAGE_EXT.test(v));
    if (typeof firstString === "string") return firstString;
  }
  return `Item ${index + 1}`;
}

const move = <T,>(arr: T[], i: number, dir: -1 | 1) => {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

/* --------------------------------------------------------------- components */

export function ContentEditor({ value, defaults, onChange }: { value: unknown; defaults: unknown; onChange: (v: unknown) => void }) {
  if (!isObj(value) || Object.keys(value).length === 0) {
    return <EmptyState title="No editable fields yet" description="This section doesn't define any content fields yet. Check back once the page has been wired up." />;
  }
  return <ObjectFields value={value} defaults={isObj(defaults) ? defaults : {}} onChange={onChange} depth={0} />;
}

function ObjectFields({ value, defaults, onChange, depth }: { value: Obj; defaults: Obj; onChange: (v: Obj) => void; depth: number }) {
  const entries = Object.entries(value);
  // Scalars first so headline copy sits above nested groups and lists.
  const scalars = entries.filter(([, v]) => isPrimitive(v) || v === null || v === undefined);
  const complex = entries.filter(([, v]) => !(isPrimitive(v) || v === null || v === undefined));
  return (
    <div className="space-y-5">
      {scalars.length > 0 && (
        <div className={cn("grid grid-cols-1 gap-4", depth > 0 && "md:grid-cols-2")}>
          {scalars.map(([k, v]) => (
            <FieldNode key={k} name={k} value={v} def={defaults[k]} onChange={(nv) => onChange({ ...value, [k]: nv })} depth={depth} />
          ))}
        </div>
      )}
      {complex.map(([k, v]) => (
        <FieldNode key={k} name={k} value={v} def={defaults[k]} onChange={(nv) => onChange({ ...value, [k]: nv })} depth={depth} />
      ))}
    </div>
  );
}

function FieldNode({ name, value, def, onChange, depth, label }: { name: string; value: unknown; def: unknown; onChange: (v: unknown) => void; depth: number; label?: ReactNode }) {
  const title = label ?? humanize(name);

  if (Array.isArray(value)) {
    return <ArrayField name={name} label={title} value={value} def={Array.isArray(def) ? def : []} onChange={onChange} depth={depth} />;
  }

  if (isObj(value)) {
    return (
      <fieldset className={cn("min-w-0 rounded-xl border border-[#E5E7EB] p-4", depth % 2 === 0 ? "bg-[#F9FAFB]" : "bg-white")}>
        <legend className="px-1.5 text-xs font-semibold uppercase tracking-wider text-[#9E774C]">{title}</legend>
        {Object.keys(value).length === 0 ? (
          <p className="text-xs text-[#8B93A1]">No fields.</p>
        ) : (
          <ObjectFields value={value} defaults={isObj(def) ? def : {}} onChange={onChange} depth={depth + 1} />
        )}
      </fieldset>
    );
  }

  return <ScalarField name={name} label={title} value={value} def={def} onChange={onChange} />;
}

function ScalarField({ name, label, value, def, onChange }: { name: string; label: ReactNode; value: unknown; def: unknown; onChange: (v: unknown) => void }) {
  const type = value === null || value === undefined ? typeof def : typeof value;

  if (type === "boolean") {
    return (
      <div className="flex min-h-[38px] items-center">
        <Toggle checked={!!value} onChange={onChange} label={label} />
      </div>
    );
  }

  if (type === "number") {
    return <NumberInput label={label} value={typeof value === "number" ? value : Number(def) || 0} onChange={onChange} />;
  }

  if (type !== "string" && value !== null && value !== undefined) {
    return (
      <FieldShell label={label} hint="This value can't be edited here.">
        <pre className="overflow-x-auto rounded-md bg-[#F9FAFB] p-2 text-xs">{JSON.stringify(value, null, 2)}</pre>
      </FieldShell>
    );
  }

  const str = typeof value === "string" ? value : "";
  const kind = scalarKind(name, str, def);
  const placeholder = typeof def === "string" && def !== str ? def : undefined;

  switch (kind) {
    case "image":
      return <ImageField label={label} value={str} onChange={onChange} className="md:col-span-2" />;
    case "video":
      return <ImageField label={label} value={str} onChange={onChange} kind="video" className="md:col-span-2" />;
    case "color":
      return <ColorField label={label} value={str} onChange={onChange} />;
    case "link":
      return (
        <TextField
          label={label}
          value={str}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aside={
            str ? (
              <a href={str} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-[#9E774C] hover:underline">
                Open <ExternalLink className="h-3 w-3" />
              </a>
            ) : undefined
          }
        />
      );
    case "textarea":
      return (
        <TextAreaField
          label={label}
          value={str}
          onChange={(e) => onChange(e.target.value)}
          rows={Math.min(10, Math.max(3, Math.ceil(Math.max(str.length, typeof def === "string" ? def.length : 0) / 90) + str.split("\n").length - 1))}
          className="md:col-span-2"
          placeholder={placeholder}
        />
      );
    default:
      return <TextField label={label} value={str} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />;
  }
}

function NumberInput({ label, value, onChange }: { label?: ReactNode; value: number; onChange: (v: number) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <TextField
      label={label}
      type="number"
      step="any"
      inputMode="decimal"
      value={draft ?? String(value)}
      onChange={(e) => {
        setDraft(e.target.value);
        const n = Number(e.target.value);
        if (e.target.value.trim() !== "" && Number.isFinite(n)) onChange(n);
      }}
      onBlur={() => setDraft(null)}
    />
  );
}

/* ------------------------------------------------------------------ arrays */

function ArrayField({ name, label, value, def, onChange, depth }: { name: string; label: ReactNode; value: unknown[]; def: unknown[]; onChange: (v: unknown) => void; depth: number }) {
  const template = def[0] !== undefined ? def[0] : value[0];
  const objectItems = isObj(template) || value.some(isObj);

  if (objectItems) {
    return <ObjectList name={name} label={label} value={value} template={template} onChange={onChange} depth={depth} />;
  }
  return <PrimitiveList name={name} label={label} value={value} template={template} onChange={onChange} />;
}

function ListHeader({ label, count, onAdd, addDisabled }: { label: ReactNode; count: number; onAdd?: () => void; addDisabled?: boolean }) {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#9E774C]">
        {label} <span className="font-normal normal-case tracking-normal text-[#8B93A1]">({count})</span>
      </p>
      {onAdd && (
        <Button size="sm" onClick={onAdd} disabled={addDisabled} icon={<Plus className="h-3.5 w-3.5" />}>
          Add
        </Button>
      )}
    </div>
  );
}

function PrimitiveList({ name, label, value, template, onChange }: { name: string; label: ReactNode; value: unknown[]; template: unknown; onChange: (v: unknown) => void }) {
  const add = () => onChange([...value, typeof template === "number" ? 0 : typeof template === "boolean" ? false : ""]);
  return (
    <div className="min-w-0 rounded-xl border border-[#E5E7EB] bg-white p-4">
      <ListHeader label={label} count={value.length} onAdd={add} />
      {value.length === 0 ? (
        <p className="text-xs text-[#8B93A1]">Empty list.</p>
      ) : (
        <ol className="space-y-2">
          {value.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-2.5 w-5 shrink-0 text-right text-[11px] text-[#9CA3AF]">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <ScalarField name={name} label={undefined} value={item} def={template} onChange={(nv) => onChange(value.map((x, idx) => (idx === i ? nv : x)))} />
              </div>
              <RowControls
                index={i}
                length={value.length}
                onMove={(dir) => onChange(move(value, i, dir))}
                onRemove={() => onChange(value.filter((_, idx) => idx !== i))}
              />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function RowControls({ index, length, onMove, onRemove, onDuplicate }: { index: number; length: number; onMove: (dir: -1 | 1) => void; onRemove: () => void; onDuplicate?: () => void }) {
  return (
    <div className="flex shrink-0 items-center">
      <IconButton label="Move up" disabled={index === 0} onClick={() => onMove(-1)} className="h-7 w-7">
        <ArrowUp className="h-3.5 w-3.5" />
      </IconButton>
      <IconButton label="Move down" disabled={index === length - 1} onClick={() => onMove(1)} className="h-7 w-7">
        <ArrowDown className="h-3.5 w-3.5" />
      </IconButton>
      {onDuplicate && (
        <IconButton label="Duplicate" onClick={onDuplicate} className="h-7 w-7">
          <Copy className="h-3.5 w-3.5" />
        </IconButton>
      )}
      <IconButton label="Remove" onClick={onRemove} className="h-7 w-7 hover:bg-[#FBE9E6] hover:text-[#B4402F]">
        <Trash2 className="h-3.5 w-3.5" />
      </IconButton>
    </div>
  );
}

function ObjectList({ name, label, value, template, onChange, depth }: { name: string; label: ReactNode; value: unknown[]; template: unknown; onChange: (v: unknown) => void; depth: number }) {
  // Collapse long lists by default; track toggled cards by index.
  const [toggled, setToggled] = useState<Set<number>>(() => new Set());
  const defaultOpen = value.length <= 3;
  const isOpen = (i: number) => (toggled.has(i) ? !defaultOpen : defaultOpen);
  const flip = (i: number) =>
    setToggled((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  const add = () => {
    onChange([...value, blankLike(template ?? {})]);
    if (!defaultOpen) flip(value.length);
  };

  return (
    <div className="min-w-0 rounded-xl border border-[#E5E7EB] bg-white p-4">
      <ListHeader label={label} count={value.length} onAdd={add} addDisabled={template === undefined} />
      {value.length === 0 ? (
        <p className="text-xs text-[#8B93A1]">Empty list.{template === undefined ? " There's no item template to add from." : ""}</p>
      ) : (
        <ol className="space-y-2">
          {value.map((item, i) => {
            const open = isOpen(i);
            return (
              <li key={i} className="overflow-hidden rounded-lg border border-[#EEF0F3]">
                <div className="flex items-center gap-1 bg-[#F9FAFB] px-2 py-1.5">
                  <button type="button" onClick={() => flip(i)} className="flex min-w-0 flex-1 items-center gap-1.5 text-left text-sm" aria-expanded={open}>
                    {open ? <ChevronDown className="h-4 w-4 shrink-0 text-[#9E774C]" /> : <ChevronRight className="h-4 w-4 shrink-0 text-[#9E774C]" />}
                    <span className="shrink-0 text-[11px] text-[#9CA3AF]">{i + 1}.</span>
                    <span className="truncate font-medium">{itemTitle(item, i)}</span>
                  </button>
                  <RowControls
                    index={i}
                    length={value.length}
                    onMove={(dir) => onChange(move(value, i, dir))}
                    onDuplicate={() => onChange([...value.slice(0, i + 1), structuredClone(item), ...value.slice(i + 1)])}
                    onRemove={() => onChange(value.filter((_, idx) => idx !== i))}
                  />
                </div>
                {open && (
                  <div className="p-3">
                    {isObj(item) ? (
                      <ObjectFields
                        value={item}
                        defaults={isObj(template) ? template : {}}
                        onChange={(nv) => onChange(value.map((x, idx) => (idx === i ? nv : x)))}
                        depth={depth + 1}
                      />
                    ) : (
                      <FieldNode name={name} value={item} def={template} onChange={(nv) => onChange(value.map((x, idx) => (idx === i ? nv : x)))} depth={depth + 1} label="Value" />
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

