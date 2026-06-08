import { Link } from 'react-router-dom';
import { Search, Brain, BookmarkCheck, LayoutGrid, Sparkles, GraduationCap, NotebookPen, GitCompare, ClipboardCheck, BookOpen, AlertTriangle, Download, MessageCircle, Smile, ClipboardList, BookA, ShieldCheck, Stethoscope, ChevronRight } from 'lucide-react';
import { CATEGORIES, DISORDERS } from '@/data/disorders';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import DisorderCard from '@/components/DisorderCard';
import { getRecent, useBookmarks } from '@/lib/storage';
import { useRole, ROLE_META } from '@/lib/role';
import { downloadDisorderCsv } from '@/lib/exportCsv';

export default function Home() {
  const [role] = useRole();
  const meta = ROLE_META[role];
  const { ids: bookmarks } = useBookmarks();
  const recentIds = getRecent();
  const recent = recentIds.map((id) => DISORDERS.find((d) => d.id === id)).filter(Boolean);

  return (
    <div className="mx-auto max-w-2xl">
      {/* Hero */}
      <header className="relative overflow-hidden gradient-hero text-primary-foreground px-5 pt-8 pb-10 rounded-b-[2rem] shadow-elevated">
        <div className="absolute inset-0 gradient-glow opacity-60 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] opacity-80">
            <Brain className="h-3.5 w-3.5" />
            <span>PsyDx · DSM-5</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-[1.1]">
            A calm, clinical reference for the mind.
          </h1>
          <p className="mt-2 text-sm text-primary-foreground/80 max-w-md">
            {meta.emoji} {meta.label} mode · {meta.tagline}
          </p>

          <Link
            to="/search"
            className="mt-6 flex items-center gap-3 rounded-2xl bg-card/95 px-4 py-3.5 text-card-foreground shadow-elevated transition active:scale-[0.99]"
          >
            <Search className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Search disorders, symptoms, ICD codes…</span>
          </Link>
        </div>
      </header>

      <div className="px-5 pt-6 space-y-6">
        <DisclaimerBanner compact />

        {/* Role chip */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span>Signed in as <span className="text-foreground font-medium">{meta.label}</span>.</span>
          <Link to="/settings" className="text-primary font-medium">Change</Link>
        </div>

        {/* Quick actions — role aware */}
        <section className="grid grid-cols-2 gap-3">
          {role === 'practitioner' && <>
            <QuickTile to="/assessment" icon={Stethoscope} title="Assessment Session" subtitle="Structured DSM-5 workflow" />
            <QuickTile to="/checklist" icon={ClipboardCheck} title="DSM-5 Checklist" subtitle="Criteria matching" />
            <QuickTile to="/symptom" icon={Sparkles} title="Symptom → Criteria" subtitle="Structured mapping" />
            <QuickTile to="/compare" icon={GitCompare} title="Differential" subtitle="Side-by-side" />
            <QuickTile to="/risk" icon={AlertTriangle} title="Risk & Safety" subtitle="Structured flags" />
            <QuickTile to="/notes" icon={NotebookPen} title="Clinical Notes" subtitle="Documentation" muted />
          </>}
          {role === 'researcher' && <>
            <QuickTile to="/categories" icon={LayoutGrid} title="DSM Library" subtitle={`${CATEGORIES.length} groups`} />
            <button onClick={downloadDisorderCsv} className="text-left rounded-2xl border border-border bg-card p-4 shadow-soft transition hover:shadow-elevated">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><Download className="h-5 w-5" /></div>
                <div><div className="font-semibold leading-tight">Export CSV</div><div className="text-[11px] text-primary">Full dataset</div></div>
              </div>
            </button>
            <QuickTile to="/glossary" icon={BookA} title="Glossary" subtitle="Terminology" muted />
            <QuickTile to="/cases" icon={BookOpen} title="Case Library" subtitle="Vignettes" muted />
          </>}
          {role === 'student' && <>
            <QuickTile to="/study" icon={GraduationCap} title="Study Mode" subtitle="Flashcards & quiz" />
            <QuickTile to="/cases" icon={BookOpen} title="Case Learning" subtitle="Vignettes" />
            <QuickTile to="/categories" icon={LayoutGrid} title="DSM Library" subtitle="Browse disorders" muted />
            <QuickTile to="/glossary" icon={BookA} title="Glossary" subtitle="Clinical terms" muted />
          </>}
          <QuickTile to="/bookmarks" icon={BookmarkCheck} title="Saved" subtitle="Your bookmarks" muted />
        </section>

        {/* Universal tools — always available */}
        <Section title="Educational tools">
          <div className="grid grid-cols-2 gap-3">
            <QuickTile to="/chat" icon={MessageCircle} title="DSM Q&A" subtitle="Educational chat" />
            <QuickTile to="/screeners" icon={ClipboardList} title="Screeners" subtitle="PHQ-9 · GAD-7 · PCL-5" />
            <QuickTile to="/mood" icon={Smile} title="Mood Journal" subtitle="Daily check-in" muted />
            <QuickTile to="/glossary" icon={BookA} title="Glossary" subtitle="Clinical terms" muted />
          </div>
        </Section>

        {/* Recent */}
        {recent.length > 0 && (
          <Section title="Continue exploring">
            <div className="space-y-3">
              {recent.slice(0, 3).map((d) => d && <DisorderCard key={d.id} disorder={d} />)}
            </div>
          </Section>
        )}

        {/* Bookmarks */}
        {bookmarks.length > 0 && (
          <Section
            title="Saved"
            action={
              <Link to="/bookmarks" className="text-xs font-medium text-primary">
                See all
              </Link>
            }
          >
            <div className="space-y-3">
              {bookmarks.slice(0, 2).map((id) => {
                const d = DISORDERS.find((x) => x.id === id);
                return d ? <DisorderCard key={id} disorder={d} /> : null;
              })}
            </div>
          </Section>
        )}

        {/* DSM-5 Hub — every disorder, accessible from the front page */}
        <Section
          title="DSM-5 Library"
          action={<Link to="/categories" className="text-xs font-medium text-primary">All categories</Link>}
        >
          <p className="-mt-1 mb-3 text-xs text-muted-foreground">
            {DISORDERS.length} disorders across {CATEGORIES.length} DSM-5-TR groupings — every entry directly accessible.
          </p>
          <div className="space-y-4">
            {CATEGORIES.map((c) => {
              const items = DISORDERS.filter((d) => d.category === c.slug);
              if (!items.length) return null;
              return (
                <div key={c.slug} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                  <Link
                    to={`/categories/${c.slug}`}
                    className="flex items-center justify-between gap-2 group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-8 rounded-full" style={{ background: `hsl(${c.colorVar})` }} />
                        <span className="font-display font-semibold leading-tight">{c.name}</span>
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground">{items.length} disorders</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
                  </Link>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {items.map((d) => (
                      <Link
                        key={d.id}
                        to={`/disorder/${d.id}`}
                        className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] hover:border-primary hover:text-primary transition"
                        title={d.name}
                      >
                        {d.shortName ?? d.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        <BookmarkCheck className="hidden" />
      </div>
    </div>
  );
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="animate-fade-up">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function QuickTile({
  to,
  icon: Icon,
  title,
  subtitle,
  muted,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  muted?: boolean;
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-border bg-card p-4 shadow-soft transition hover:shadow-elevated"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="font-semibold leading-tight">{title}</div>
          <div className={`text-[11px] ${muted ? 'text-muted-foreground' : 'text-primary'}`}>{subtitle}</div>
        </div>
      </div>
    </Link>
  );
}
