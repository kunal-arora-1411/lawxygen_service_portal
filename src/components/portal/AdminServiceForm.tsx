import { FormEvent, useState } from "react";
import { PortalIcon } from "./PortalIcons";
import { ServiceRecord } from "@/services/serviceApi";
import styles from "./AdminServiceForm.module.css";

type PairRow = [string, string];
type RelatedRow = { title: string; href: string };

interface ServiceFormValues {
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  accent: string;
  variant: string;
  archetype: string;
  summary: string;
  highlights: string[];
  checklist: PairRow[];
  overview: string[];
  benefits: PairRow[];
  documents: PairRow[];
  process: PairRow[];
  faqs: PairRow[];
  related: RelatedRow[];
  cta: string;
  note: string;
  bg: string;
  soft: string;
  price: string;
  isActive: boolean;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function blankForm(): ServiceFormValues {
  return {
    title: "", slug: "", category: "", categorySlug: "",
    accent: "", variant: "1", archetype: "", summary: "",
    highlights: [], checklist: [], overview: [], benefits: [],
    documents: [], process: [], faqs: [], related: [],
    cta: "", note: "", bg: "", soft: "", price: "", isActive: true,
  };
}

function formFromService(service: ServiceRecord): ServiceFormValues {
  return {
    title: service.title ?? "",
    slug: service.slug ?? "",
    category: service.category ?? "",
    categorySlug: service.categorySlug ?? "",
    accent: service.accent ?? "",
    variant: service.variant != null ? String(service.variant) : "1",
    archetype: service.archetype ?? "",
    summary: service.summary ?? "",
    highlights: service.highlights ?? [],
    checklist: service.checklist ?? [],
    overview: service.overview ?? [],
    benefits: service.benefits ?? [],
    documents: service.documents ?? [],
    process: service.process ?? [],
    faqs: service.faqs ?? [],
    related: service.related ?? [],
    cta: service.cta ?? "",
    note: service.note ?? "",
    bg: service.bg ?? "",
    soft: service.soft ?? "",
    price: service.price != null ? String(service.price) : "",
    isActive: service.isActive ?? true,
  };
}

function TextListEditor({ values, onChange, placeholder, emptyHint }: {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  emptyHint: string;
}) {
  const update = (i: number, value: string) => onChange(values.map((v, idx) => (idx === i ? value : v)));
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  return (
    <div className={styles.fieldGroup}>
      {values.length === 0 && <p className={styles.emptyHint}>{emptyHint}</p>}
      {values.map((value, i) => (
        <div className={styles.listRow} key={i}>
          <input value={value} placeholder={placeholder} onChange={(e) => update(i, e.target.value)} />
          <button type="button" onClick={() => remove(i)} aria-label="Remove item"><PortalIcon name="trash" size={14} /></button>
        </div>
      ))}
      <button type="button" className={styles.addRow} onClick={() => onChange([...values, ""])}>
        <PortalIcon name="plus" size={13} /> Add
      </button>
    </div>
  );
}

function PairListEditor({ values, onChange, placeholderA, placeholderB, emptyHint }: {
  values: PairRow[];
  onChange: (values: PairRow[]) => void;
  placeholderA: string;
  placeholderB: string;
  emptyHint: string;
}) {
  const update = (i: number, pos: 0 | 1, value: string) => {
    onChange(values.map((row, idx) => {
      if (idx !== i) return row;
      const next: PairRow = [row[0], row[1]];
      next[pos] = value;
      return next;
    }));
  };
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  return (
    <div className={styles.fieldGroup}>
      {values.length === 0 && <p className={styles.emptyHint}>{emptyHint}</p>}
      {values.map((row, i) => (
        <div className={styles.pairRow} key={i}>
          <input value={row[0] ?? ""} placeholder={placeholderA} onChange={(e) => update(i, 0, e.target.value)} />
          <input value={row[1] ?? ""} placeholder={placeholderB} onChange={(e) => update(i, 1, e.target.value)} />
          <button type="button" onClick={() => remove(i)} aria-label="Remove row"><PortalIcon name="trash" size={14} /></button>
        </div>
      ))}
      <button type="button" className={styles.addRow} onClick={() => onChange([...values, ["", ""]])}>
        <PortalIcon name="plus" size={13} /> Add
      </button>
    </div>
  );
}

function RelatedListEditor({ values, onChange }: {
  values: RelatedRow[];
  onChange: (values: RelatedRow[]) => void;
}) {
  const update = (i: number, key: keyof RelatedRow, value: string) =>
    onChange(values.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)));
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  return (
    <div className={styles.fieldGroup}>
      {values.length === 0 && <p className={styles.emptyHint}>No related services linked.</p>}
      {values.map((row, i) => (
        <div className={styles.pairRow} key={i}>
          <input value={row.title} placeholder="Title" onChange={(e) => update(i, "title", e.target.value)} />
          <input value={row.href} placeholder="/services/..." onChange={(e) => update(i, "href", e.target.value)} />
          <button type="button" onClick={() => remove(i)} aria-label="Remove row"><PortalIcon name="trash" size={14} /></button>
        </div>
      ))}
      <button type="button" className={styles.addRow} onClick={() => onChange([...values, { title: "", href: "" }])}>
        <PortalIcon name="plus" size={13} /> Add
      </button>
    </div>
  );
}

type Props = {
  initial?: ServiceRecord;
  submitting: boolean;
  errorMessage?: string | null;
  onSubmit: (payload: Omit<ServiceRecord, "_id">) => void;
  onCancel: () => void;
};

export function AdminServiceForm({ initial, submitting, errorMessage, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<ServiceFormValues>(() => (initial ? formFromService(initial) : blankForm()));
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [categorySlugTouched, setCategorySlugTouched] = useState(Boolean(initial));

  const set = <K extends keyof ServiceFormValues>(key: K, value: ServiceFormValues[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleTitleChange = (value: string) => {
    set("title", value);
    if (!slugTouched) set("slug", slugify(value));
  };

  const handleCategoryChange = (value: string) => {
    set("category", value);
    if (!categorySlugTouched) set("categorySlug", slugify(value));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const cleanPairs = (rows: PairRow[]) => rows.filter((row) => row[0]?.trim() || row[1]?.trim());
    const cleanStrings = (rows: string[]) => rows.map((v) => v.trim()).filter(Boolean);

    const payload: Omit<ServiceRecord, "_id"> = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      category: form.category.trim(),
      categorySlug: form.categorySlug.trim(),
      accent: form.accent.trim(),
      variant: Number(form.variant) || 0,
      archetype: form.archetype.trim(),
      summary: form.summary.trim(),
      highlights: cleanStrings(form.highlights),
      checklist: cleanPairs(form.checklist),
      overview: cleanStrings(form.overview),
      benefits: cleanPairs(form.benefits),
      documents: cleanPairs(form.documents),
      process: cleanPairs(form.process),
      faqs: cleanPairs(form.faqs),
      related: form.related.filter((row) => row.title?.trim() || row.href?.trim()),
      cta: form.cta.trim(),
      note: form.note.trim(),
      bg: form.bg.trim(),
      soft: form.soft.trim(),
      price: form.price.trim() ? Number(form.price) : undefined,
      isActive: form.isActive,
    };

    onSubmit(payload);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formHead}>
        <div>
          <strong>{initial ? "Edit service" : "New service"}</strong>
          <span>{initial ? initial.title : "Add a new entry to the service catalogue."}</span>
        </div>
        <div className={styles.formHeadActions}>
          <button type="button" className={styles.ghostButton} onClick={onCancel}>Cancel</button>
          <button type="submit" className={styles.primaryButton} disabled={submitting}>
            {submitting ? "Saving…" : initial ? "Save changes" : "Create service"}
          </button>
        </div>
      </div>

      {errorMessage && <p className={styles.formError}>{errorMessage}</p>}

      <section className={styles.section}>
        <h2>Basics</h2>
        <div className={styles.grid2}>
          <label>Title
            <input required value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="e.g. Private Limited Company Registration" />
          </label>
          <label>Slug
            <input required value={form.slug} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }} placeholder="private-limited-company-registration" />
          </label>
          <label>Category
            <input required value={form.category} onChange={(e) => handleCategoryChange(e.target.value)} placeholder="e.g. Business Setup" />
          </label>
          <label>Category slug
            <input required value={form.categorySlug} onChange={(e) => { setCategorySlugTouched(true); set("categorySlug", e.target.value); }} placeholder="business-setup" />
          </label>
          <label>Archetype
            <input value={form.archetype} onChange={(e) => set("archetype", e.target.value)} placeholder="e.g. registration" />
          </label>
          <label>Variant
            <input type="number" value={form.variant} onChange={(e) => set("variant", e.target.value)} />
          </label>
          <label>Price
            <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="e.g. 4999" />
          </label>
          <label className={styles.toggleField}>
            <span>Published</span>
            <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} />
          </label>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Presentation</h2>
        <div className={styles.grid2}>
          <label>Accent
            <input value={form.accent} onChange={(e) => set("accent", e.target.value)} placeholder="#2680c9" />
          </label>
          <label>Background
            <input value={form.bg} onChange={(e) => set("bg", e.target.value)} />
          </label>
          <label>Soft tone
            <input value={form.soft} onChange={(e) => set("soft", e.target.value)} />
          </label>
          <label>CTA label
            <input value={form.cta} onChange={(e) => set("cta", e.target.value)} placeholder="Get started" />
          </label>
        </div>
        <label className={styles.fullField}>Note
          <input value={form.note} onChange={(e) => set("note", e.target.value)} placeholder="Short footnote shown on the service page" />
        </label>
      </section>

      <section className={styles.section}>
        <h2>Summary</h2>
        <textarea value={form.summary} onChange={(e) => set("summary", e.target.value)} rows={3} placeholder="One or two sentences describing this service." />
      </section>

      <section className={styles.section}>
        <h2>Highlights</h2>
        <TextListEditor values={form.highlights} onChange={(v) => set("highlights", v)} placeholder="e.g. Filed within 7 working days" emptyHint="No highlights yet." />
      </section>

      <section className={styles.section}>
        <h2>Overview</h2>
        <TextListEditor values={form.overview} onChange={(v) => set("overview", v)} placeholder="Overview point" emptyHint="No overview points yet." />
      </section>

      <section className={styles.section}>
        <h2>Checklist</h2>
        <PairListEditor values={form.checklist} onChange={(v) => set("checklist", v)} placeholderA="Item" placeholderB="Detail" emptyHint="No checklist items yet." />
      </section>

      <section className={styles.section}>
        <h2>Benefits</h2>
        <PairListEditor values={form.benefits} onChange={(v) => set("benefits", v)} placeholderA="Benefit" placeholderB="Detail" emptyHint="No benefits yet." />
      </section>

      <section className={styles.section}>
        <h2>Required documents</h2>
        <PairListEditor values={form.documents} onChange={(v) => set("documents", v)} placeholderA="Document" placeholderB="Detail" emptyHint="No documents listed yet." />
      </section>

      <section className={styles.section}>
        <h2>Process</h2>
        <PairListEditor values={form.process} onChange={(v) => set("process", v)} placeholderA="Step" placeholderB="Detail" emptyHint="No process steps yet." />
      </section>

      <section className={styles.section}>
        <h2>FAQs</h2>
        <PairListEditor values={form.faqs} onChange={(v) => set("faqs", v)} placeholderA="Question" placeholderB="Answer" emptyHint="No FAQs yet." />
      </section>

      <section className={styles.section}>
        <h2>Related services</h2>
        <RelatedListEditor values={form.related} onChange={(v) => set("related", v)} />
      </section>
    </form>
  );
}
