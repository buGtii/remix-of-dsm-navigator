import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ClipboardList, Trash2, FileText } from 'lucide-react';
import { listSessions, deleteSession, type AssessmentSession } from '@/lib/assessment';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AssessmentsPage() {
  const [sessions, setSessions] = useState<AssessmentSession[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    try { setSessions(await listSessions()); }
    catch (e: any) { toast.error(e.message ?? 'Failed to load sessions'); }
    finally { setLoading(false); }
  };
  useEffect(() => { reload(); }, []);

  const remove = async (id: string) => {
    if (!confirm('Delete this assessment session? This cannot be undone.')) return;
    try { await deleteSession(id); setSessions((s) => s.filter((x) => x.id !== id)); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pt-5 pb-10 space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold">Assessment Sessions</h1>
            <p className="text-xs text-muted-foreground">DSM-5 guided clinical assessments · private to you</p>
          </div>
        </div>
        <Button asChild className="h-10"><Link to="/assessment/new"><Plus className="h-4 w-4 mr-1" /> New</Link></Button>
      </header>

      <DisclaimerBanner compact />

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : sessions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
          <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">No assessment sessions yet.</p>
          <Button asChild className="mt-4"><Link to="/assessment/new">Start your first assessment</Link></Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {sessions.map((s) => (
            <li key={s.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft flex items-center justify-between">
              <Link to={`/assessment/${s.id}`} className="min-w-0 flex-1">
                <div className="font-display font-semibold truncate">{s.patient_label || 'Untitled session'}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {s.status === 'complete' ? 'Complete' : 'Draft'} · {(s.candidates?.length ?? 0)} candidates · updated {new Date(s.updated_at).toLocaleDateString()}
                </div>
              </Link>
              <button onClick={() => remove(s.id)} className="ml-3 p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-[11px] italic text-muted-foreground text-center">
        PsyDx is a DSM-5 clinical support tool. Final diagnosis always rests with the licensed clinician.
      </p>
    </div>
  );
}