import { supabase } from '@/integrations/supabase/client';

export type FunctionalDomain = 'occupational' | 'social' | 'relationships' | 'academic' | 'daily';
export type Impairment = 'none' | 'mild' | 'moderate' | 'severe';

export interface Intake {
  presenting: string[];                          // free-form symptom tags
  onset?: string;                                // e.g. "3 months ago"
  duration?: string;                             // e.g. "ongoing 6+ weeks"
  frequency?: 'rare' | 'weekly' | 'daily' | 'constant';
  severity?: 'mild' | 'moderate' | 'severe';
  triggers?: string;
  progression?: 'improving' | 'stable' | 'worsening' | 'episodic';
  functional: Partial<Record<FunctionalDomain, Impairment>>;
  notes?: string;
}

export interface RiskFlags {
  suicidalIdeation?: boolean;
  selfHarm?: boolean;
  homicidal?: boolean;
  psychosis?: boolean;
  mania?: boolean;
  severeImpairment?: boolean;
  notes?: string;
}

export interface CriteriaState {
  // disorderId -> array of booleans indexed by criteriaSummary
  [disorderId: string]: boolean[];
}

export interface DifferentialState {
  // disorderId -> clinician note distinguishing it
  [disorderId: string]: string;
}

export interface AssessmentSession {
  id: string;
  user_id: string;
  patient_label: string | null;
  status: 'draft' | 'complete';
  intake: Intake;
  candidates: string[];                          // disorder ids
  criteria: CriteriaState;
  differential: DifferentialState;
  risk: RiskFlags;
  impression: string | null;
  plan: string | null;
  created_at: string;
  updated_at: string;
}

export const EMPTY_INTAKE: Intake = { presenting: [], functional: {} };

export async function listSessions(): Promise<AssessmentSession[]> {
  const { data, error } = await supabase
    .from('assessment_sessions')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as AssessmentSession[];
}

export async function getSession(id: string): Promise<AssessmentSession | null> {
  const { data, error } = await supabase
    .from('assessment_sessions')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as AssessmentSession) ?? null;
}

export async function createSession(patient_label: string): Promise<AssessmentSession> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error('Authentication required');
  const { data, error } = await supabase
    .from('assessment_sessions')
    .insert({ user_id: u.user.id, patient_label, intake: EMPTY_INTAKE })
    .select('*')
    .single();
  if (error) throw error;
  return data as unknown as AssessmentSession;
}

export async function updateSession(id: string, patch: Partial<AssessmentSession>): Promise<void> {
  const { error } = await supabase.from('assessment_sessions').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteSession(id: string): Promise<void> {
  const { error } = await supabase.from('assessment_sessions').delete().eq('id', id);
  if (error) throw error;
}

// ---- Local draft fallback (offline / no auth) ----
const DRAFT_KEY = 'psydx:assessment:draft';
export function loadDraft(): Partial<AssessmentSession> | null {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null'); } catch { return null; }
}
export function saveDraft(s: Partial<AssessmentSession>) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(s));
}
export function clearDraft() { localStorage.removeItem(DRAFT_KEY); }
