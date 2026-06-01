import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { ROLE_META, useRole, can, type Capability } from '@/lib/role';
import { Button } from '@/components/ui/button';

/**
 * Gates a route to roles that hold a given capability.
 * PsyDx policy: diagnostic-support tools are clinician-only.
 * Non-clinicians see a clear, professional "restricted" screen explaining
 * why and offering a way back. This is a UX guard, not a security boundary —
 * server-enforced RLS still protects any sensitive data on the backend.
 */
export default function RequireCapability({
  cap,
  children,
}: {
  cap: Capability;
  children: React.ReactNode;
}) {
  const [role] = useRole();
  if (can(role, cap)) return <>{children}</>;

  return (
    <div className="mx-auto max-w-md px-6 py-16 text-center animate-fade-up">
      <div className="mx-auto h-16 w-16 rounded-2xl bg-primary-soft text-primary flex items-center justify-center">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h1 className="mt-5 font-display text-2xl font-semibold">Clinician-only tool</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        This DSM-5 diagnostic-support workflow is restricted to verified clinicians.
        You are currently signed in as <span className="text-foreground font-medium">{ROLE_META[role].label}</span>.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        PsyDx assists, but never replaces, clinical judgment. Final diagnosis always rests with a licensed clinician.
      </p>
      <div className="mt-6 grid gap-2">
        <Button asChild className="h-11">
          <Link to="/settings">Switch role in Settings</Link>
        </Button>
        <Button asChild variant="ghost" className="h-11">
          <Link to="/"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}