import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Save, FileDown, Check, Plus, X,
  ClipboardList, ListChecks, GitCompare, AlertTriangle, Stethoscope, FileText,
} from 'lucide-react';
import {
  createSession, getSession, updateSession,
  type AssessmentSession, type Intake, type RiskFlags, type CriteriaState, type DifferentialState,
  EMPTY_INTAKE,
} from '@/lib/assessment';
import { DISORDERS } from '@/data/disorders';
import { fastSearch } from '@/lib/searchIndex';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { exportNoteToPDF } from '@/lib/pdf';
import { toast } from 'sonner';
import DisclaimerBanner from '@/components/DisclaimerBanner';

type Stage = 0 | 1 | 2 | 3 | 4 | 5;
const STAGES: { key: Stage; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 0, label: 'Intake', icon: ClipboardList },
  { key: 1, label: 'Candidates', icon: Stethoscope },
  { key: 2, label: 'Criteria', icon: ListChecks },
  { key: 3, label: 'Differential', icon: GitCompare },
  { key: 4, label: 'Risk', icon: AlertTriangle },
  { key: 5, label: 'Impression', icon: FileText },
];

const FUNCTIONAL: { key: keyof Intake['functional']; label: string }[] = [
  { key: 'occupational', label: 'Occupational' },
  { key: 'social', label: 'Social' },
  { key: 'relationships', label: 'Relationships' },
  { key: 'academic', label: 'Academic' },
  { key: 'daily', label: 'Daily living' },
];
const IMPAIRMENT_LEVELS = ['none', 'mild', 'moderate', 'severe'] as const;

export default function AssessmentSessionPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const isNew = !id || id === 'new';

  const [stage, setStage] = useState<Stage>(0);
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [label, setLabel] = useState('');
  const [intake, setIntake] = useState<Intake>(EMPTY_INTAKE);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [criteria, setCriteria] = useState<CriteriaState>({});
  const [differential, setDifferential] = useState<DifferentialState>({});
  const [risk, setRisk] = useState<RiskFlags>({});
  const [impression, setImpression] = useState('');
  const [plan, setPlan] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const s = await getSession(id!);
        if (!s) { toast.error('Session not found'); nav('/assessment'); return; }
        setSession(s);
        setLabel(s.patient_label || '');
        setIntake({ ...EMPTY_INTAKE, ...(s.intake || {}) });
        setCandidates(s.candidates || []);
        setCriteria(s.criteria || {});
        setDifferential(s.differential || {});
        setRisk(s.risk || {});
        setImpression(s.impression || '');
        setPlan(s.plan || '');
      } catch (e: any) { toast.error(e.message); }
    })();
  }, [id, isNew, nav]);

  const save = async (status?: 'draft' | 'complete') => {
    setSaving(true);
    try {
      if (isNew || !session) {
        const created = await createSession(label || 'Untitled session');
        await updateSession(created.id, {
          patient_label: label, intake, candidates, criteria, differential, risk,
          impression, plan, status: status ?? 'draft',
        });
        toast.success('Session saved');
        nav(`/assessment/${created.id}`, { replace: true });
      } else {
        await updateSession(session.id, {
          patient_label: label, intake, candidates, criteria, differential, risk,
          impression, plan, ...(status ? { status } : {}),
        });
        toast.success(status === 'complete' ? 'Marked complete' : 'Saved');
      }
    } catch (e: any) { toast.error(e.message ?? 'Save failed'); }
    finally { setSaving(false); }
  };

  const exportPdf = () => {
    const lines: string[] = [];
    lines.push(`Patient label: ${label || '—'}`);
    lines.push(`Date: ${new Date().toLocaleString()}`);
    lines.push('');
    lines.push('— INTAKE —');
    lines.push(`Presenting complaints: ${intake.presenting.join(', ') || '—'}`);
    lines.push(`Onset: ${intake.onset || '—'}    Duration: ${intake.duration || '—'}`);
    lines.push(`Frequency: ${intake.frequency || '—'}    Severity: ${intake.severity || '—'}    Progression: ${intake.progression || '—'}`);
    lines.push(`Triggers: ${intake.triggers || '—'}`);
    lines.push(`Functional impairment:`);
    for (const f of FUNCTIONAL) lines.push(`  • ${f.label}: ${intake.functional[f.key] || 'not assessed'}`);
    if (intake.notes) lines.push(`Notes: ${intake.notes}`);
    lines.push('');
    lines.push('— CANDIDATE DISORDERS (DSM-5 guided) —');
    for (const cid of candidates) {
      const d = DISORDERS.find((x) => x.id === cid); if (!d) continue;
      const marks = criteria[cid] || [];
      const met = marks.filter(Boolean).length;
      lines.push(`• ${d.name} — paraphrased criteria met: ${met}/${d.criteriaSummary.length}`);
      d.criteriaSummary.forEach((c, i) => lines.push(`    [${marks[i] ? 'x' : ' '}] ${c}`));
      if (differential[cid]) lines.push(`    Differential note: ${differential[cid]}`);
    }
    lines.push('');
    lines.push('— RISK / SAFETY —');
    const flags = [
      ['Suicidal ideation', risk.suicidalIdeation],
      ['Self-harm', risk.selfHarm],
      ['Homicidal ideation', risk.homicidal],
      ['Psychosis indicators', risk.psychosis],
      ['Mania indicators', risk.mania],
      ['Severe functional impairment', risk.severeImpairment],
    ] as const;
    for (const [k, v] of flags) lines.push(`  [${v ? 'x' : ' '}] ${k}`);
    if (risk.notes) lines.push(`Notes: ${risk.notes}`);
    lines.push('');
    lines.push('— CLINICAL IMPRESSION —');
    lines.push(impression || '—');
    lines.push('');
    lines.push('— PLAN —');
    lines.push(plan || '—');
    exportNoteToPDF(
      `PsyDx Assessment — ${label || 'Untitled'}`,
      lines.join('\n'),
      'Clinical decision support — not a diagnosis. DSM-5 criteria paraphrased for educational use.',
    );
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pt-5 pb-28 space-y-5">
      <header className="flex items-center gap-3">
        <button onClick={() => nav('/assessment')} className="h-10 w-10 rounded-xl bg-muted text-foreground flex items-center justify-center">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Patient label (e.g. Pt 042 · initials only)"
            className="font-display text-lg"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Use non-identifying labels. PsyDx is decision support, not a clinical record system.
          </p>
        </div>
      </header>

      {/* Stage stepper */}
      <nav className="grid grid-cols-6 gap-1 text-[10px]">
        {STAGES.map(({ key, label: l, icon: Icon }) => {
          const active = stage === key;
          return (
            <button
              key={key}
              onClick={() => setStage(key)}
              className={`flex flex-col items-center gap-1 rounded-xl border p-2 transition ${
                active ? 'border-primary bg-primary-soft text-primary' : 'border-border bg-card text-muted-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{l}</span>
            </button>
          );
        })}
      </nav>

      {stage === 0 && <IntakeStage intake={intake} setIntake={setIntake} />}
      {stage === 1 && <CandidatesStage intake={intake} candidates={candidates} setCandidates={setCandidates} />}
      {stage === 2 && <CriteriaStage candidates={candidates} criteria={criteria} setCriteria={setCriteria} />}
      {stage === 3 && <DifferentialStage candidates={candidates} differential={differential} setDifferential={setDifferential} />}
      {stage === 4 && <RiskStage risk={risk} setRisk={setRisk} />}
      {stage === 5 && (
        <ImpressionStage
          impression={impression} setImpression={setImpression}
          plan={plan} setPlan={setPlan}
        />
      )}

      <DisclaimerBanner compact />

      {/* Sticky action bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/95 backdrop-blur px-4 py-3">
        <div className="mx-auto max-w-2xl flex items-center gap-2">
          <Button variant="ghost" disabled={stage === 0} onClick={() => setStage((s) => (s - 1) as Stage)} className="h-10">
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          <Button variant="outline" onClick={() => save('draft')} disabled={saving} className="h-10">
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
          <Button variant="outline" onClick={exportPdf} className="h-10">
            <FileDown className="h-4 w-4 mr-1" /> Export
          </Button>
          {stage < 5 ? (
            <Button onClick={() => setStage((s) => (s + 1) as Stage)} className="h-10 ml-auto">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => save('complete')} disabled={saving} className="h-10 ml-auto">
              <Check className="h-4 w-4 mr-1" /> Complete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------- Stage components ----------------

function StageCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-soft animate-fade-up space-y-4">
      <div>
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function IntakeStage({ intake, setIntake }: { intake: Intake; setIntake: (i: Intake) => void }) {
  const [draft, setDraft] = useState('');
  const addPresenting = () => {
    const v = draft.trim(); if (!v) return;
    if (intake.presenting.includes(v)) { setDraft(''); return; }
    setIntake({ ...intake, presenting: [...intake.presenting, v] }); setDraft('');
  };
  const removePresenting = (v: string) =>
    setIntake({ ...intake, presenting: intake.presenting.filter((x) => x !== v) });

  return (
    <StageCard title="Stage 1 · Symptom collection" subtitle="Document presenting complaints, course, and functional impairment.">
      <div>
        <Label>Presenting complaints</Label>
        <div className="mt-1 flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPresenting(); } }}
            placeholder="e.g. low mood, intrusive thoughts, panic attacks…"
          />
          <Button onClick={addPresenting} type="button" variant="outline"><Plus className="h-4 w-4" /></Button>
        </div>
        {intake.presenting.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {intake.presenting.map((p) => (
              <span key={p} className="inline-flex items-center gap-1 rounded-full bg-primary-soft text-primary px-2.5 py-1 text-xs">
                {p}
                <button onClick={() => removePresenting(p)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Onset"><Input value={intake.onset ?? ''} onChange={(e) => setIntake({ ...intake, onset: e.target.value })} placeholder="e.g. 3 months ago" /></Field>
        <Field label="Duration"><Input value={intake.duration ?? ''} onChange={(e) => setIntake({ ...intake, duration: e.target.value })} placeholder="e.g. ≥6 weeks" /></Field>
        <Field label="Frequency">
          <Select value={intake.frequency ?? ''} onChange={(v) => setIntake({ ...intake, frequency: v as any })}
            options={['', 'rare', 'weekly', 'daily', 'constant']} />
        </Field>
        <Field label="Severity">
          <Select value={intake.severity ?? ''} onChange={(v) => setIntake({ ...intake, severity: v as any })}
            options={['', 'mild', 'moderate', 'severe']} />
        </Field>
        <Field label="Progression">
          <Select value={intake.progression ?? ''} onChange={(v) => setIntake({ ...intake, progression: v as any })}
            options={['', 'improving', 'stable', 'worsening', 'episodic']} />
        </Field>
        <Field label="Triggers"><Input value={intake.triggers ?? ''} onChange={(e) => setIntake({ ...intake, triggers: e.target.value })} placeholder="e.g. work stress, anniversary" /></Field>
      </div>

      <div>
        <Label>Functional impairment</Label>
        <div className="mt-2 space-y-2">
          {FUNCTIONAL.map((f) => (
            <div key={f.key} className="grid grid-cols-[1fr_auto] items-center gap-3">
              <span className="text-sm">{f.label}</span>
              <div className="flex gap-1">
                {IMPAIRMENT_LEVELS.map((lvl) => {
                  const on = intake.functional[f.key] === lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => setIntake({ ...intake, functional: { ...intake.functional, [f.key!]: lvl } })}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition ${
                        on ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background'
                      }`}
                    >{lvl}</button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Field label="Clinical notes">
        <Textarea rows={3} value={intake.notes ?? ''} onChange={(e) => setIntake({ ...intake, notes: e.target.value })}
          placeholder="Context, mental status observations, collateral information…" />
      </Field>
    </StageCard>
  );
}

function CandidatesStage({ intake, candidates, setCandidates }: { intake: Intake; candidates: string[]; setCandidates: (c: string[]) => void }) {
  const suggested = useMemo(() => {
    if (!intake.presenting.length) return [];
    const hits = fastSearch(intake.presenting.join(' '), 12);
    return hits.filter((d) => !candidates.includes(d.id));
  }, [intake.presenting, candidates]);
  const [q, setQ] = useState('');
  const searchResults = useMemo(() => q ? fastSearch(q, 15).filter((d) => !candidates.includes(d.id)) : [], [q, candidates]);

  const add = (id: string) => setCandidates([...candidates, id]);
  const remove = (id: string) => setCandidates(candidates.filter((x) => x !== id));

  return (
    <StageCard title="Stage 2 · Candidate DSM-5 disorders" subtitle="Build a working list to evaluate against criteria. Selection is not a diagnosis.">
      <div>
        <Label>Selected ({candidates.length})</Label>
        {candidates.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No candidates yet. Pick from suggestions or search.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {candidates.map((cid) => {
              const d = DISORDERS.find((x) => x.id === cid); if (!d) return null;
              return (
                <li key={cid} className="flex items-center justify-between rounded-xl border border-primary bg-primary-soft/40 px-3 py-2">
                  <span className="text-sm font-medium">{d.name}</span>
                  <button onClick={() => remove(cid)} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {suggested.length > 0 && (
        <div>
          <Label>Suggested from presenting complaints</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {suggested.slice(0, 8).map((d) => (
              <button key={d.id} onClick={() => add(d.id)} className="rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:border-primary hover:text-primary transition">
                + {d.shortName ?? d.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label>Search the DSM library</Label>
        <Input className="mt-1" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search disorders, ICD codes, symptoms…" />
        {searchResults.length > 0 && (
          <ul className="mt-2 max-h-60 overflow-auto space-y-1">
            {searchResults.map((d) => (
              <li key={d.id}>
                <button onClick={() => { add(d.id); setQ(''); }} className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-muted">
                  <div className="font-medium">{d.name}</div>
                  <div className="text-[11px] text-muted-foreground">{d.icd10 ?? ''} · {d.category}</div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </StageCard>
  );
}

function CriteriaStage({ candidates, criteria, setCriteria }: { candidates: string[]; criteria: CriteriaState; setCriteria: (c: CriteriaState) => void }) {
  if (!candidates.length) return <StageCard title="Stage 3 · Criteria matching"><p className="text-sm text-muted-foreground">Add candidate disorders first.</p></StageCard>;
  const setMark = (cid: string, idx: number, v: boolean) => {
    const d = DISORDERS.find((x) => x.id === cid)!;
    const cur = criteria[cid] ?? new Array(d.criteriaSummary.length).fill(false);
    const next = cur.slice(); next[idx] = v;
    setCriteria({ ...criteria, [cid]: next });
  };
  return (
    <StageCard title="Stage 3 · DSM-5 criteria matching" subtitle="Paraphrased criteria summaries. Threshold judgment requires clinical evaluation.">
      <div className="space-y-4">
        {candidates.map((cid) => {
          const d = DISORDERS.find((x) => x.id === cid); if (!d) return null;
          const marks = criteria[cid] ?? new Array(d.criteriaSummary.length).fill(false);
          const met = marks.filter(Boolean).length;
          return (
            <div key={cid} className="rounded-xl border border-border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display font-semibold">{d.name}</div>
                  <div className="text-[11px] text-muted-foreground">{d.icd10 ?? ''}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-display font-semibold text-primary">{met}/{d.criteriaSummary.length}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">met</div>
                </div>
              </div>
              <ul className="mt-3 space-y-1.5">
                {d.criteriaSummary.map((c, i) => {
                  const on = !!marks[i];
                  return (
                    <li key={i}>
                      <label className={`flex gap-3 rounded-lg border px-3 py-2 cursor-pointer text-sm ${on ? 'border-primary bg-primary-soft/40' : 'border-border'}`}>
                        <input type="checkbox" checked={on} onChange={(e) => setMark(cid, i, e.target.checked)} className="mt-0.5 h-4 w-4 accent-primary" />
                        <span>{c}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </StageCard>
  );
}

function DifferentialStage({ candidates, differential, setDifferential }: { candidates: string[]; differential: DifferentialState; setDifferential: (d: DifferentialState) => void }) {
  if (!candidates.length) return <StageCard title="Stage 4 · Differential"><p className="text-sm text-muted-foreground">Add candidates first.</p></StageCard>;
  return (
    <StageCard title="Stage 4 · Differential reasoning" subtitle="Note distinguishing features and rule-outs for each candidate.">
      <div className="space-y-3">
        {candidates.map((cid) => {
          const d = DISORDERS.find((x) => x.id === cid); if (!d) return null;
          return (
            <div key={cid} className="rounded-xl border border-border p-3 space-y-2">
              <div className="font-display font-semibold">{d.name}</div>
              {d.differentials?.length && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Consider vs:</span> {d.differentials.join(' · ')}
                </div>
              )}
              <Textarea
                rows={2}
                placeholder="Distinguishing features, rule-outs, overlapping symptoms…"
                value={differential[cid] ?? ''}
                onChange={(e) => setDifferential({ ...differential, [cid]: e.target.value })}
              />
            </div>
          );
        })}
      </div>
    </StageCard>
  );
}

const RISK_ITEMS: { key: keyof RiskFlags; label: string; severe?: boolean }[] = [
  { key: 'suicidalIdeation', label: 'Suicidal ideation', severe: true },
  { key: 'selfHarm', label: 'Self-harm behavior', severe: true },
  { key: 'homicidal', label: 'Homicidal ideation', severe: true },
  { key: 'psychosis', label: 'Psychosis indicators' },
  { key: 'mania', label: 'Mania indicators' },
  { key: 'severeImpairment', label: 'Severe functional impairment' },
];

function RiskStage({ risk, setRisk }: { risk: RiskFlags; setRisk: (r: RiskFlags) => void }) {
  const anySevere = RISK_ITEMS.some((i) => i.severe && (risk as any)[i.key]);
  return (
    <StageCard title="Stage 5 · Risk & safety" subtitle="Flag concerns for documentation. PsyDx surfaces; the clinician decides on safety planning.">
      <ul className="space-y-2">
        {RISK_ITEMS.map((it) => {
          const on = !!(risk as any)[it.key];
          return (
            <li key={it.key}>
              <label className={`flex items-center justify-between rounded-xl border px-3 py-2.5 cursor-pointer ${on ? (it.severe ? 'border-destructive bg-destructive/5' : 'border-primary bg-primary-soft/40') : 'border-border'}`}>
                <span className="text-sm font-medium">{it.label}</span>
                <input type="checkbox" checked={on} onChange={(e) => setRisk({ ...risk, [it.key]: e.target.checked })} className="h-4 w-4 accent-primary" />
              </label>
            </li>
          );
        })}
      </ul>
      <Textarea rows={3} placeholder="Risk formulation, protective factors, safety plan notes…"
        value={risk.notes ?? ''} onChange={(e) => setRisk({ ...risk, notes: e.target.value })} />
      {anySevere && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
          One or more acute-risk flags noted. Initiate appropriate safety protocols per your clinical setting. In the US, 988 reaches the Suicide & Crisis Lifeline.
        </div>
      )}
    </StageCard>
  );
}

function ImpressionStage({ impression, setImpression, plan, setPlan }: {
  impression: string; setImpression: (s: string) => void;
  plan: string; setPlan: (s: string) => void;
}) {
  return (
    <StageCard title="Stage 6 · Clinical impression & plan" subtitle="Your professional formulation. PsyDx is decision support — this is your judgment.">
      <Field label="Clinical impression / working formulation">
        <Textarea rows={5} value={impression} onChange={(e) => setImpression(e.target.value)}
          placeholder="Working formulation, leading consideration, severity, specifiers under consideration…" />
      </Field>
      <Field label="Plan">
        <Textarea rows={5} value={plan} onChange={(e) => setPlan(e.target.value)}
          placeholder="Further assessment, referrals, treatment considerations, follow-up cadence…" />
      </Field>
    </StageCard>
  );
}

// ---- tiny UI helpers ----
function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1"><Label>{label}</Label>{children}</div>;
}
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
    >
      {options.map((o) => <option key={o} value={o}>{o || '—'}</option>)}
    </select>
  );
}