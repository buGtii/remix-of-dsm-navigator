import { useEffect, useState } from 'react';

export type Role = 'student' | 'clinician' | 'therapist' | 'researcher';

export const ROLE_META: Record<Role, { label: string; tagline: string; emoji: string }> = {
  clinician: { label: 'Clinician', tagline: 'DSM-5 guided assessment & decision support', emoji: '🩺' },
  therapist: { label: 'Therapist', tagline: 'Case conceptualization & therapy support', emoji: '🧠' },
  researcher: { label: 'Researcher', tagline: 'DSM exploration, data & export', emoji: '🔬' },
  student: { label: 'Student', tagline: 'Learn DSM with study tools & cases', emoji: '🎓' },
};

const KEY = 'psychref:role';

export function getRole(): Role {
  const raw = (typeof window !== 'undefined' && localStorage.getItem(KEY)) || '';
  // Backward-compat: legacy 'patient' role maps to 'therapist'.
  const v = raw === 'patient' ? 'therapist' : (raw as Role);
  return v && v in ROLE_META ? v : 'student';
}
export function setRole(role: Role) {
  localStorage.setItem(KEY, role);
  window.dispatchEvent(new Event('psychref:role'));
}

export function useRole(): [Role, (r: Role) => void] {
  const [r, setR] = useState<Role>(() => getRole());
  useEffect(() => {
    const h = () => setR(getRole());
    window.addEventListener('psychref:role', h);
    window.addEventListener('storage', h);
    return () => {
      window.removeEventListener('psychref:role', h);
      window.removeEventListener('storage', h);
    };
  }, []);
  return [r, (next) => { setRole(next); setR(next); }];
}

// ---------- Permissions ----------
// Diagnostic-support tools are clinician-only by policy.
// PsyDx is a DSM-5 helper; final diagnosis always rests with the clinician.
export type Capability =
  | 'diagnostic.checklist'       // DSM criteria checklist
  | 'diagnostic.differential'    // Side-by-side differential comparison
  | 'diagnostic.symptomMatch'    // Symptom → DSM criteria matching (AI Explorer)
  | 'diagnostic.risk'            // Risk / safety screen
  | 'clinical.notes'             // Structured clinical documentation
  | 'therapy.caseConcept'        // Case conceptualization
  | 'research.export'            // Bulk data export
  | 'education.study';           // Study mode / flashcards / cases

const CAPS: Record<Role, Capability[]> = {
  clinician: [
    'diagnostic.checklist',
    'diagnostic.differential',
    'diagnostic.symptomMatch',
    'diagnostic.risk',
    'clinical.notes',
    'therapy.caseConcept',
    'research.export',
    'education.study',
  ],
  therapist: [
    'therapy.caseConcept',
    'clinical.notes',
    'education.study',
  ],
  researcher: [
    'research.export',
    'education.study',
  ],
  student: [
    'education.study',
  ],
};

export function can(role: Role, cap: Capability): boolean {
  return CAPS[role]?.includes(cap) ?? false;
}

export function useCan(cap: Capability): boolean {
  const [role] = useRole();
  return can(role, cap);
}
