import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Activity, Ban, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight,
  ArrowRightLeft, CircleDollarSign, ExternalLink, Eye, Filter, Globe2, Mail, MoreHorizontal,
  RefreshCw, Search, ShieldCheck, Trash2, UserRound, UsersRound, X,
} from 'lucide-react';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ManagedUser {
  id: number; name: string; email: string; phone?: string | null; role: string;
  is_active: boolean; email_verified_at?: string | null; created_at: string;
  active_plan?: string | null; active_plan_id?: number | null; subscription_status?: string | null;
  is_published: boolean; site_name?: string | null; site_slug?: string | null;
  galleries_count: number; invoices_count: number;
}
interface Plan { id: number; name: string; is_active: boolean }
interface Summary { total: number; active: number; inactive: number; subscribed: number; published: number }
interface Meta { current_page: number; last_page: number; per_page: number; total: number; from: number | null; to: number | null }
interface DeleteImpact { user: Pick<ManagedUser, 'id'|'name'|'email'|'role'|'is_active'>; impact: Record<string, number>; can_delete: boolean; recommended_action: string }

const emptySummary: Summary = { total: 0, active: 0, inactive: 0, subscribed: 0, published: 0 };
const emptyMeta: Meta = { current_page: 1, last_page: 1, per_page: 25, total: 0, from: null, to: null };

export default function PhotographersList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [summary, setSummary] = useState<Summary>(emptySummary);
  const [meta, setMeta] = useState<Meta>(emptyMeta);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [role, setRole] = useState<'user'|'admin'|'superadmin'|'staff'|'all'>('user');
  const [status, setStatus] = useState('all');
  const [subscription, setSubscription] = useState('all');
  const [published, setPublished] = useState('all');
  const [planId, setPlanId] = useState('');
  const [page, setPage] = useState(1);
  const [impact, setImpact] = useState<DeleteImpact | null>(null);
  const [impactLoading, setImpactLoading] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [reason, setReason] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => window.clearTimeout(timeout);
  }, [query]);

  const params = useMemo(() => ({
    q: debouncedQuery || undefined, role, status, subscription, published,
    plan_id: planId || undefined, page, per_page: 25,
  }), [debouncedQuery, role, status, subscription, published, planId, page]);

  const load = async () => {
    setLoading(true);
    try {
      const response = await api.get('/superadmin/users', { params });
      setUsers(response.data.data ?? []);
      setSummary(response.data.summary ?? emptySummary);
      setMeta(response.data.meta ?? emptyMeta);
      setPlans(response.data.plans ?? []);
    } catch (error) {
      toast.error('La liste des utilisateurs ne peut pas être chargée.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [params]);
  useEffect(() => { setPage(1); }, [debouncedQuery, role, status, subscription, published, planId]);

  const resetFilters = () => {
    setQuery(''); setRole('user'); setStatus('all'); setSubscription('all'); setPublished('all'); setPlanId(''); setPage(1);
  };

  const toggleActive = async (user: ManagedUser) => {
    try {
      const response = await api.patch(`/superadmin/users/${user.id}/toggle-active`, { reason: user.is_active ? 'Suspension opérateur depuis le registre utilisateurs' : 'Réactivation opérateur depuis le registre utilisateurs' });
      setUsers(current => current.map(item => item.id === user.id ? { ...item, is_active: response.data.is_active } : item));
      toast.success(response.data.is_active ? 'Compte réactivé.' : 'Compte suspendu.');
      void load();
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Le statut ne peut pas être modifié.');
    }
  };

  const togglePublish = async (user: ManagedUser) => {
    try {
      const response = await api.patch(`/superadmin/users/${user.id}/toggle-publish`, { reason: 'Pilotage de la visibilité depuis le registre utilisateurs' });
      setUsers(current => current.map(item => item.id === user.id ? { ...item, is_published: response.data.is_published } : item));
      toast.success(response.data.is_published ? 'Site publié.' : 'Site dépublié.');
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'La publication ne peut pas être modifiée.');
    }
  };

  const inspectDeletion = async (user: ManagedUser) => {
    setImpactLoading(true); setConfirmation(''); setReason('');
    try {
      const response = await api.get(`/superadmin/users/${user.id}/deletion-impact`);
      setImpact(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Impossible d’analyser l’impact de suppression.');
    } finally { setImpactLoading(false); }
  };

  const executeDelete = async () => {
    if (!impact?.can_delete) return;
    setDeleting(true);
    try {
      await api.delete(`/superadmin/users/${impact.user.id}`, { data: { confirmation, reason } });
      toast.success('Compte supprimé et action journalisée.');
      setImpact(null); await load();
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'La suppression a été bloquée.');
    } finally { setDeleting(false); }
  };

  const summaryCards = [
    { label: 'Comptes', value: summary.total, icon: UsersRound, tone: 'text-slate-900', note: 'Portefeuille total' },
    { label: 'Actifs', value: summary.active, icon: Activity, tone: 'text-emerald-700', note: `${summary.inactive} suspendu(s)` },
    { label: 'Abonnés', value: summary.subscribed, icon: CircleDollarSign, tone: 'text-teal-700', note: 'Forfait actif' },
    { label: 'Sites en ligne', value: summary.published, icon: Globe2, tone: 'text-blue-700', note: 'Visibles publiquement' },
  ];

  return (
    <main className="mx-auto max-w-[1500px] space-y-6 pb-12">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Centre de contrôle · Clients</p>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-slate-950 md:text-4xl">Portefeuille utilisateurs</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Retrouvez chaque compte, son abonnement, son site et son activité depuis un registre unique.</p>
        </div>
        <Button variant="outline" onClick={() => void load()} className="h-11 gap-2 rounded-xl border-slate-200 bg-white">
          <RefreshCw className="h-4 w-4" /> Actualiser
        </Button>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Synthèse du portefeuille">
        {summaryCards.map(({ label, value, icon: Icon, tone, note }) => (
          <article key={label} className="rounded-2xl bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.055)] ring-1 ring-slate-200/70">
            <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-500">{label}</span><Icon className={`h-5 w-5 ${tone}`} /></div>
            <p className={`mt-4 text-3xl font-semibold tabular-nums tracking-tight ${tone}`}>{value}</p>
            <p className="mt-1 text-xs text-slate-400">{note}</p>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/80">
        <div className="border-b border-slate-100 p-4 md:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Nom, email ou téléphone…" className="h-11 rounded-xl border-slate-200 bg-slate-50/70 pl-10 focus-visible:ring-emerald-600" />
            </div>
            <div className="flex gap-2 rounded-xl bg-slate-100 p-1">
              <button onClick={() => setRole('user')} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${role === 'user' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}>Utilisateurs</button>
              <button onClick={() => setRole('staff')} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${role === 'staff' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}>Administrateurs</button>
              <button onClick={() => setRole('all')} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${role === 'all' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}>Tous</button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select aria-label="Filtrer par statut" value={status} onChange={event => setStatus(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700">
              <option value="all">Tous les statuts</option><option value="active">Actifs</option><option value="inactive">Suspendus</option>
            </select>
            <select aria-label="Filtrer par abonnement" value={subscription} onChange={event => setSubscription(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700">
              <option value="all">Tous les abonnements</option><option value="active">Avec abonnement</option><option value="none">Sans abonnement</option>
            </select>
            <select aria-label="Filtrer par plan" value={planId} onChange={event => setPlanId(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700">
              <option value="">Tous les forfaits</option>{plans.map(plan => <option key={plan.id} value={plan.id}>{plan.name}{plan.is_active ? '' : ' · inactif'}</option>)}
            </select>
            <select aria-label="Filtrer par publication" value={published} onChange={event => setPublished(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700">
              <option value="all">Tous les sites</option><option value="published">Sites publiés</option><option value="unpublished">Sites non publiés</option><option value="none">Sans site</option>
            </select>
            <button onClick={resetFilters} className="h-10 px-3 text-sm font-medium text-slate-500 transition hover:text-slate-900">Réinitialiser</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              <tr><th className="px-5 py-4">Compte</th><th className="px-5 py-4">Abonnement</th><th className="px-5 py-4">Empreinte</th><th className="px-5 py-4">Inscription</th><th className="px-5 py-4">État</th><th className="px-5 py-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && Array.from({ length: 6 }).map((_, index) => <tr key={index}>{Array.from({ length: 6 }).map((__, cell) => <td className="px-5 py-4" key={cell}><Skeleton className="h-9 w-full rounded-lg" /></td>)}</tr>)}
              {!loading && users.map(user => (
                <tr key={user.id} className="group transition hover:bg-emerald-50/30">
                  <td className="px-5 py-4"><button onClick={() => navigate(`/superadmin/users/${user.id}`)} className="flex items-center gap-3 text-left"><span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-sm font-semibold text-white">{user.name.slice(0, 1).toUpperCase()}</span><span><span className="block font-semibold text-slate-900 group-hover:text-emerald-800">{user.name}</span><span className="block text-xs text-slate-500">{user.email}</span></span></button></td>
                  <td className="px-5 py-4"><span className={user.active_plan ? 'font-semibold text-slate-800' : 'text-slate-400'}>{user.active_plan ?? 'Aucun forfait'}</span><span className="block text-xs text-slate-400">{user.role}</span></td>
                  <td className="px-5 py-4"><div className="flex gap-3 text-xs text-slate-500"><span>{user.galleries_count} galerie(s)</span><span>{user.invoices_count} facture(s)</span></div>{user.site_name && <span className="mt-1 block text-xs text-slate-400">{user.site_name}</span>}</td>
                  <td className="px-5 py-4 text-slate-600"><span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-slate-400" />{new Date(user.created_at).toLocaleDateString('fr-FR')}</span></td>
                  <td className="px-5 py-4"><div className="flex flex-wrap gap-1.5"><span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${user.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{user.is_active ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}{user.is_active ? 'Actif' : 'Suspendu'}</span>{user.is_published && <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">Site publié</span>}</div></td>
                  <td className="px-5 py-4 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={`Actions pour ${user.name}`} className="rounded-lg"><MoreHorizontal className="h-5 w-5" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56"><DropdownMenuItem onClick={() => navigate(`/superadmin/users/${user.id}`)}><Eye className="mr-2 h-4 w-4" />Ouvrir la fiche 360°</DropdownMenuItem><DropdownMenuItem onClick={() => navigate(`/superadmin/users/${user.id}#abonnement`)}><ArrowRightLeft className="mr-2 h-4 w-4" />{user.active_plan ? 'Changer le forfait' : 'Attribuer un forfait'}</DropdownMenuItem><DropdownMenuItem onClick={() => window.location.assign(`mailto:${user.email}`)}><Mail className="mr-2 h-4 w-4" />Contacter</DropdownMenuItem>{user.site_slug && <DropdownMenuItem onClick={() => window.open(`/${user.site_slug}`, '_blank')}><ExternalLink className="mr-2 h-4 w-4" />Voir le site</DropdownMenuItem>}<DropdownMenuSeparator /><DropdownMenuItem onClick={() => void togglePublish(user)} disabled={!user.site_name}><Globe2 className="mr-2 h-4 w-4" />{user.is_published ? 'Dépublier le site' : 'Publier le site'}</DropdownMenuItem><DropdownMenuItem onClick={() => void toggleActive(user)}><Activity className="mr-2 h-4 w-4" />{user.is_active ? 'Suspendre le compte' : 'Réactiver le compte'}</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onClick={() => void inspectDeletion(user)} className="text-red-600 focus:text-red-700"><Trash2 className="mr-2 h-4 w-4" />Analyser la suppression</DropdownMenuItem></DropdownMenuContent></DropdownMenu></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && users.length === 0 && <div className="px-6 py-20 text-center"><UserRound className="mx-auto h-10 w-10 text-slate-300" /><h2 className="mt-4 font-semibold text-slate-900">Aucun compte ne correspond</h2><p className="mt-1 text-sm text-slate-500">Modifiez les filtres ou la recherche.</p></div>}
        </div>

        <footer className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">{meta.from ?? 0}–{meta.to ?? 0} sur <span className="font-semibold text-slate-800">{meta.total}</span> résultat(s)</p>
          <div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled={meta.current_page <= 1 || loading} onClick={() => setPage(value => value - 1)}><ChevronLeft className="mr-1 h-4 w-4" />Précédent</Button><span className="px-2 text-sm tabular-nums text-slate-600">{meta.current_page} / {meta.last_page}</span><Button variant="outline" size="sm" disabled={meta.current_page >= meta.last_page || loading} onClick={() => setPage(value => value + 1)}>Suivant<ChevronRight className="ml-1 h-4 w-4" /></Button></div>
        </footer>
      </section>

      {(impactLoading || impact) && <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/35 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Analyse de suppression"><section className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600">Zone sensible</p><h2 className="mt-1 text-xl font-semibold text-slate-950">Analyse d’impact</h2></div><button onClick={() => setImpact(null)} aria-label="Fermer"><X className="h-5 w-5 text-slate-400" /></button></div>{impactLoading ? <div className="mt-6 space-y-3"><Skeleton className="h-12 w-full" /><Skeleton className="h-24 w-full" /></div> : impact && <><p className="mt-4 text-sm text-slate-600">Compte : <strong>{impact.user.name}</strong> · {impact.user.email}</p><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">{Object.entries(impact.impact).map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-3 text-center"><span className="block text-xl font-semibold tabular-nums">{value}</span><span className="text-[11px] text-slate-500">{label}</span></div>)}</div>{!impact.can_delete ? <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><strong>Suppression bloquée.</strong> Ce compte possède des données. Suspendez-le ou traitez ses ressources depuis la fiche 360°.</div> : <div className="mt-5 space-y-3"><Input value={reason} onChange={event => setReason(event.target.value)} placeholder="Motif obligatoire de suppression" /><Input value={confirmation} onChange={event => setConfirmation(event.target.value)} placeholder={`Tapez ${impact.user.email}`} /><Button variant="destructive" className="w-full" disabled={confirmation !== impact.user.email || reason.trim().length < 5 || deleting} onClick={() => void executeDelete()}>{deleting ? 'Suppression…' : 'Supprimer définitivement ce compte vide'}</Button></div>}<Button variant="outline" className="mt-3 w-full" onClick={() => setImpact(null)}>Fermer</Button></>}</section></div>}
    </main>
  );
}
