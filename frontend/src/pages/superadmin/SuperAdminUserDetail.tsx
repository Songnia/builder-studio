import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Activity, ArrowLeft, ArrowRightLeft, CalendarClock, CheckCircle2, CircleDollarSign, Clock3,
  ExternalLink, FileText, GalleryHorizontalEnd, Globe2, History, KeyRound,
  MailCheck, MailX, Pause, Play, RefreshCw, Save, ShieldCheck, Smartphone,
  UserRoundCog, XCircle,
} from 'lucide-react';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

interface Overview {
  user: { id:number; name:string; email:string; phone?:string|null; role:string; is_active:boolean; email_verified_at?:string|null; created_at:string; updated_at:string };
  stats: { galleries:number; sites:number; subscriptions:number; invoices:number; sessions:number };
  sites:Array<{id:number;site_name:string;slug?:string;is_published:boolean;updated_at:string}>;
  galleries:Array<{id:number;uuid:string;title:string;status:string;created_at:string}>;
  subscriptions:Array<{id:number;plan?:{id:number;name:string};billing_cycle:string;status:string;payment_status?:string;starts_at?:string|null;ends_at?:string|null;created_at:string}>;
  invoices:Array<{id:number;invoice_number:string;total_amount:number;amount_paid:number;status:string;currency:string;issue_date:string}>;
  audit_logs:Array<{id:number;action:string;reason?:string|null;before_data?:Record<string,unknown>;after_data?:Record<string,unknown>;created_at:string;actor?:{name:string;email:string}}>
}
interface Plan { id:number; name:string; price:number; yearly_price?:number; is_active:boolean }

const formatDate = (value?: string | null) => value ? new Date(value).toLocaleString('fr-FR', { dateStyle:'medium', timeStyle:'short' }) : '—';
const getApiErrorMessage = (requestError: any, fallback: string) => {
  const errors = requestError.response?.data?.errors;
  if (errors && typeof errors === 'object') {
    for (const value of Object.values(errors as Record<string, unknown>)) {
      if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
      if (typeof value === 'string') return value;
    }
  }
  return requestError.response?.data?.message ?? fallback;
};
const toDateInput = (date: Date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const nextDateInput = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return toDateInput(new Date(year, month-1, day+1));
};
const actionLabels: Record<string,string> = {
  'user.created':'Compte créé','user.updated':'Profil modifié','user.activated':'Compte réactivé','user.deactivated':'Compte suspendu',
  'user.sessions_revoked':'Sessions révoquées','user.email_verified':'Email vérifié','user.email_unverified':'Vérification email retirée',
  'subscription.assigned':'Abonnement attribué','subscription.updated':'Abonnement modifié','subscription.plan_changed':'Forfait remplacé','site.published':'Site publié','site.unpublished':'Site dépublié',
};

export default function SuperAdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data,setData] = useState<Overview|null>(null);
  const [plans,setPlans] = useState<Plan[]>([]);
  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [edit,setEdit] = useState({ name:'', email:'', phone:'', role:'user', password:'', reason:'' });
  const [planForm,setPlanForm] = useState({ subscription_plan_id:'', billing_cycle:'monthly', starts_at:'', ends_at:'', reason:'' });
  const [securityReason,setSecurityReason] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [overview, planResponse] = await Promise.all([api.get(`/superadmin/users/${id}/overview`), api.get('/superadmin/plans')]);
      setData(overview.data);
      setPlans(planResponse.data.data ?? planResponse.data);
      setEdit({ name:overview.data.user.name, email:overview.data.user.email, phone:overview.data.user.phone ?? '', role:overview.data.user.role, password:'', reason:'' });
    } catch (requestError: any) {
      setError(requestError.response?.data?.message ?? 'Cette fiche utilisateur ne peut pas être chargée.');
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, [id]);
  useEffect(() => {
    if (!loading && data && window.location.hash === '#abonnement') {
      window.requestAnimationFrame(() => document.getElementById('abonnement')?.scrollIntoView({ behavior:'smooth', block:'start' }));
    }
  }, [loading, data]);
  const activeSubscription = useMemo(() => data?.subscriptions.find(item => item.status === 'active'), [data]);
  const selectedPlan = plans.find(plan => plan.id === Number(planForm.subscription_plan_id));
  const changingToSamePlan = Boolean(activeSubscription?.plan?.id && activeSubscription.plan.id === Number(planForm.subscription_plan_id));
  const reasonLength = planForm.reason.trim().length;
  const reasonCharactersMissing = Math.max(0, 5 - reasonLength);
  const todayInput = toDateInput(new Date());
  const effectiveStartInput = !activeSubscription && planForm.starts_at > todayInput ? planForm.starts_at : todayInput;
  const minimumEndDate = nextDateInput(effectiveStartInput);
  const endDateInvalid = Boolean(planForm.ends_at && planForm.ends_at < minimumEndDate);

  const saveUser = async () => {
    if (edit.reason.trim().length < 5) return toast.error('Ajoutez un motif de modification.');
    setSaving(true);
    try {
      const payload: Record<string,string> = { name:edit.name, email:edit.email, phone:edit.phone, role:edit.role, reason:edit.reason };
      if (edit.password) payload.password = edit.password;
      await api.patch(`/superadmin/users/${id}`, payload);
      toast.success('Profil mis à jour et action journalisée.');
      await load();
    } catch (requestError: any) { toast.error(requestError.response?.data?.message ?? 'La modification a échoué.'); }
    finally { setSaving(false); }
  };

  const assignPlan = async () => {
    const selectedPlanId = Number(planForm.subscription_plan_id);
    if (!selectedPlanId) return toast.error('Sélectionnez un forfait.');
    if (reasonLength < 5) return toast.error(`Le motif doit contenir au moins 5 caractères (${reasonCharactersMissing} caractère(s) requis).`);
    if (endDateInvalid) return toast.error('La date de fin doit être postérieure à la date de début et à aujourd’hui.');
    if (activeSubscription?.plan?.id === selectedPlanId) return toast.error('Sélectionnez un forfait différent du forfait actuel.');
    setSaving(true);
    try {
      const payload: Record<string, string | number> = {
        subscription_plan_id:selectedPlanId,
        billing_cycle:planForm.billing_cycle,
        reason:planForm.reason.trim(),
      };
      if (planForm.ends_at) payload.ends_at = planForm.ends_at;
      if (activeSubscription) {
        await api.post(`/superadmin/users/${id}/subscriptions/${activeSubscription.id}/change-plan`, payload);
        toast.success('Forfait modifié et ancien abonnement conservé dans l’historique.');
      } else {
        if (planForm.starts_at) payload.starts_at = planForm.starts_at;
        await api.post(`/superadmin/users/${id}/subscriptions`, payload);
        toast.success('Abonnement attribué et historique conservé.');
      }
      setPlanForm({ subscription_plan_id:'', billing_cycle:'monthly', starts_at:'', ends_at:'', reason:'' });
      await load();
    } catch (requestError: any) { toast.error(getApiErrorMessage(requestError, 'La décision d’abonnement a échoué.')); }
    finally { setSaving(false); }
  };

  const changeSubscription = async (subscriptionId:number, status:string) => {
    if (planForm.reason.trim().length < 5) return toast.error('Saisissez un motif dans la zone abonnement.');
    try {
      await api.patch(`/superadmin/users/${id}/subscriptions/${subscriptionId}`, { status, reason:planForm.reason });
      toast.success(status === 'active' ? 'Abonnement réactivé.' : 'Abonnement suspendu.');
      await load();
    } catch (requestError: any) { toast.error(requestError.response?.data?.message ?? 'La transition a échoué.'); }
  };

  const revokeSessions = async () => {
    if (securityReason.trim().length < 5) return toast.error('Indiquez le motif de révocation.');
    try {
      const response = await api.post(`/superadmin/users/${id}/revoke-tokens`, { reason:securityReason });
      toast.success(`${response.data.revoked} session(s) révoquée(s).`); setSecurityReason(''); await load();
    } catch (requestError: any) { toast.error(requestError.response?.data?.message ?? 'La révocation a échoué.'); }
  };

  const setVerification = async (verified:boolean) => {
    if (securityReason.trim().length < 5) return toast.error('Indiquez le motif de cette décision.');
    try {
      await api.patch(`/superadmin/users/${id}/email-verification`, { verified, reason:securityReason });
      toast.success('État de vérification mis à jour.'); setSecurityReason(''); await load();
    } catch (requestError: any) { toast.error(requestError.response?.data?.message ?? 'La mise à jour a échoué.'); }
  };

  if (loading) return <div className="mx-auto max-w-[1500px] space-y-5 p-2"><Skeleton className="h-12 w-80" /><Skeleton className="h-56 w-full rounded-2xl" /><div className="grid gap-4 lg:grid-cols-2"><Skeleton className="h-96 rounded-2xl" /><Skeleton className="h-96 rounded-2xl" /></div></div>;
  if (!data || error) return <div className="mx-auto max-w-xl rounded-2xl bg-white p-10 text-center shadow-sm"><XCircle className="mx-auto h-10 w-10 text-red-500" /><h1 className="mt-4 text-xl font-semibold">Fiche indisponible</h1><p className="mt-2 text-sm text-slate-500">{error}</p><Button className="mt-6" onClick={() => navigate('/superadmin/photographers')}>Retour aux utilisateurs</Button></div>;

  const statCards = [
    {label:'Galeries',value:data.stats.galleries,icon:GalleryHorizontalEnd}, {label:'Sites',value:data.stats.sites,icon:Globe2},
    {label:'Abonnements',value:data.stats.subscriptions,icon:CircleDollarSign}, {label:'Factures',value:data.stats.invoices,icon:FileText},
    {label:'Sessions',value:data.stats.sessions,icon:Smartphone},
  ];

  return <main className="mx-auto max-w-[1500px] space-y-6 pb-12">
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div><button onClick={() => navigate('/superadmin/photographers')} className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-950"><ArrowLeft className="h-4 w-4" />Portefeuille utilisateurs</button><div className="flex items-center gap-4"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-xl font-semibold text-white">{data.user.name.slice(0,1).toUpperCase()}</span><div><div className="flex flex-wrap items-center gap-2"><h1 className="text-3xl font-semibold tracking-[-0.035em] text-slate-950">{data.user.name}</h1><span className={`rounded-md px-2 py-1 text-xs font-semibold ${data.user.is_active?'bg-emerald-50 text-emerald-700':'bg-amber-50 text-amber-700'}`}>{data.user.is_active?'Actif':'Suspendu'}</span></div><p className="mt-1 text-sm text-slate-500">{data.user.email} · {data.user.role}</p></div></div></div>
      <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => void load()}><RefreshCw className="mr-2 h-4 w-4" />Actualiser</Button><Button onClick={() => document.getElementById('profil')?.scrollIntoView({behavior:'smooth'})}><UserRoundCog className="mr-2 h-4 w-4" />Modifier le compte</Button></div>
    </header>

    <nav className="sticky top-0 z-20 flex gap-1 overflow-x-auto rounded-xl bg-slate-950 p-1.5 text-sm shadow-xl shadow-slate-900/10" aria-label="Navigation de la fiche">
      {[['Synthèse','synthese'],['Abonnement','abonnement'],['Ressources','ressources'],['Sécurité','securite'],['Profil','profil'],['Historique','historique']].map(([label,anchor]) => <button key={anchor} onClick={() => document.getElementById(anchor)?.scrollIntoView({behavior:'smooth',block:'start'})} className="whitespace-nowrap rounded-lg px-4 py-2 font-medium text-slate-300 transition hover:bg-white/10 hover:text-white">{label}</button>)}
    </nav>

    <section id="synthese" className="scroll-mt-20 rounded-2xl bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/80">
      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-5">{statCards.map(({label,value,icon:Icon}) => <article key={label} className="rounded-xl bg-slate-50 p-4"><Icon className="h-5 w-5 text-emerald-700" /><p className="mt-5 text-3xl font-semibold tabular-nums text-slate-950">{value}</p><p className="text-xs text-slate-500">{label}</p></article>)}</div>
      <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 md:grid-cols-3"><div><p className="text-xs text-slate-400">Création</p><p className="mt-1 text-sm font-medium">{formatDate(data.user.created_at)}</p></div><div><p className="text-xs text-slate-400">Dernière modification</p><p className="mt-1 text-sm font-medium">{formatDate(data.user.updated_at)}</p></div><div><p className="text-xs text-slate-400">Email</p><p className="mt-1 flex items-center gap-2 text-sm font-medium">{data.user.email_verified_at?<><MailCheck className="h-4 w-4 text-emerald-600"/>Vérifié</>:<><MailX className="h-4 w-4 text-amber-600"/>Non vérifié</>}</p></div></div>
    </section>

    <section id="abonnement" className="scroll-mt-20 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
      <article className="rounded-2xl bg-slate-950 p-6 text-white"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">Abonnement en cours</p>{activeSubscription?<><h2 className="mt-4 text-3xl font-semibold">{activeSubscription.plan?.name ?? 'Plan indisponible'}</h2><p className="mt-2 text-sm text-slate-400">Cycle {activeSubscription.billing_cycle} · paiement {activeSubscription.payment_status ?? 'non renseigné'}</p><div className="mt-8 grid grid-cols-2 gap-4"><div><p className="text-xs text-slate-500">Début</p><p className="mt-1 text-sm">{formatDate(activeSubscription.starts_at)}</p></div><div><p className="text-xs text-slate-500">Fin</p><p className="mt-1 text-sm">{formatDate(activeSubscription.ends_at)}</p></div></div></>:<><CircleDollarSign className="mt-8 h-10 w-10 text-slate-600"/><h2 className="mt-4 text-xl font-semibold">Aucun abonnement actif</h2><p className="mt-2 text-sm text-slate-400">Attribuez un forfait depuis le panneau de décision.</p></>}</article>
      <article className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-semibold text-slate-950">{activeSubscription ? 'Changer de forfait' : 'Attribuer un forfait'}</h2><p className="mt-1 text-sm text-slate-500">{activeSubscription ? 'Le forfait actuel sera clôturé, jamais écrasé.' : 'Créez manuellement le premier abonnement.'}</p></div>{activeSubscription && <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">Action immédiate</span>}</div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-slate-600">Nouveau forfait<select aria-label="Nouveau forfait" value={planForm.subscription_plan_id} onChange={event=>setPlanForm({...planForm,subscription_plan_id:event.target.value})} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"><option value="">Choisir un forfait</option>{plans.filter(plan=>plan.is_active).map(plan=><option value={plan.id} key={plan.id} disabled={plan.id===activeSubscription?.plan?.id}>{plan.name}{plan.id===activeSubscription?.plan?.id?' — actuel':''}</option>)}</select></label>
          <label className="text-xs font-semibold text-slate-600">Cycle de facturation<select value={planForm.billing_cycle} onChange={event=>setPlanForm({...planForm,billing_cycle:event.target.value})} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"><option value="monthly">Mensuel</option><option value="yearly">Annuel</option></select></label>
          {!activeSubscription && <label className="text-xs font-semibold text-slate-600">Date de début<Input className="mt-1.5" type="date" value={planForm.starts_at} onChange={event=>setPlanForm({...planForm,starts_at:event.target.value})}/></label>}
          <label className="text-xs font-semibold text-slate-600">Date de fin optionnelle
            <Input className={`mt-1.5 ${endDateInvalid?'border-red-400 focus-visible:ring-red-500':''}`} type="date" min={minimumEndDate} value={planForm.ends_at} aria-invalid={endDateInvalid} onChange={event=>setPlanForm({...planForm,ends_at:event.target.value})}/>
            {endDateInvalid && <span className="mt-1.5 block text-[11px] font-medium text-red-600">La date de fin doit être postérieure à la date de début et à aujourd’hui.</span>}
          </label>
        </div>
        {activeSubscription && selectedPlan && !changingToSamePlan && <div className="mt-4 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm"><span className="font-medium text-slate-700">{activeSubscription.plan?.name}</span><ArrowRightLeft className="h-4 w-4 text-blue-600"/><span className="font-semibold text-blue-800">{selectedPlan.name}</span></div>}
        <div className="mt-4">
          <div className="flex items-center justify-between gap-3"><label htmlFor="subscription-reason" className="text-xs font-semibold text-slate-600">Motif obligatoire · 5 caractères minimum</label><span className={`text-[11px] tabular-nums ${reasonLength<5?'text-red-500':'text-emerald-600'}`}>{reasonLength}/500</span></div>
          <Input id="subscription-reason" className={`mt-1.5 ${reasonLength>0&&reasonLength<5?'border-red-400 focus-visible:ring-red-500':''}`} value={planForm.reason} minLength={5} maxLength={500} aria-invalid={reasonLength>0&&reasonLength<5} onChange={event=>setPlanForm({...planForm,reason:event.target.value})} placeholder="Ex. Migration commerciale validée"/>
          {reasonCharactersMissing>0?<p className="mt-1.5 text-[11px] font-medium text-red-600">Encore {reasonCharactersMissing} caractère(s) requis.</p>:<p className="mt-1.5 text-[11px] font-medium text-emerald-600">Motif valide et prêt à être journalisé.</p>}
        </div>
        <Button className={`mt-3 w-full ${activeSubscription?'bg-blue-700 hover:bg-blue-800':'bg-emerald-700 hover:bg-emerald-800'}`} disabled={saving || changingToSamePlan || !planForm.subscription_plan_id} onClick={() => void assignPlan()}><ArrowRightLeft className="mr-2 h-4 w-4"/>{saving?'Traitement…':activeSubscription?'Changer de forfait maintenant':'Attribuer ce forfait'}</Button>
      </article>
    </section>

    <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200"><div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold">Historique des abonnements</h2><p className="text-sm text-slate-500">Transitions et périodes de validité.</p></div><Clock3 className="h-5 w-5 text-slate-400" /></div><div className="mt-5 divide-y divide-slate-100">{data.subscriptions.map(subscription=><div key={subscription.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-slate-900">{subscription.plan?.name ?? 'Plan supprimé'} <span className={`ml-2 rounded px-2 py-1 text-xs ${subscription.status==='active'?'bg-emerald-50 text-emerald-700':'bg-slate-100 text-slate-600'}`}>{subscription.status}</span></p><p className="mt-1 text-xs text-slate-500">{subscription.billing_cycle} · {formatDate(subscription.starts_at)} → {formatDate(subscription.ends_at)}</p></div>{subscription.status==='active'?<Button size="sm" variant="outline" onClick={()=>void changeSubscription(subscription.id,'canceled')}><Pause className="mr-2 h-4 w-4"/>Suspendre</Button>:<Button size="sm" variant="outline" onClick={()=>void changeSubscription(subscription.id,'active')}><Play className="mr-2 h-4 w-4"/>Réactiver</Button>}</div>)}{data.subscriptions.length===0&&<p className="py-10 text-center text-sm text-slate-400">Aucun historique d’abonnement.</p>}</div></section>

    <section id="ressources" className="scroll-mt-20 grid gap-5 xl:grid-cols-2"><article className="rounded-2xl bg-white p-6 ring-1 ring-slate-200"><h2 className="flex items-center gap-2 text-lg font-semibold"><Globe2 className="h-5 w-5 text-blue-600"/>Sites</h2><div className="mt-4 divide-y divide-slate-100">{data.sites.map(site=><div className="flex items-center justify-between py-4" key={site.id}><div><p className="font-medium">{site.site_name}</p><p className="text-xs text-slate-500">{site.is_published?'Publié':'Non publié'} · {site.slug ?? 'sans URL'}</p></div>{site.slug&&<a href={`/${site.slug}`} target="_blank" rel="noreferrer" className="rounded-lg p-2 text-blue-600 hover:bg-blue-50" aria-label={`Voir ${site.site_name}`}><ExternalLink className="h-4 w-4"/></a>}</div>)}{data.sites.length===0&&<p className="py-10 text-center text-sm text-slate-400">Aucun site configuré.</p>}</div></article><article className="rounded-2xl bg-white p-6 ring-1 ring-slate-200"><h2 className="flex items-center gap-2 text-lg font-semibold"><GalleryHorizontalEnd className="h-5 w-5 text-violet-600"/>Galeries</h2><div className="mt-4 divide-y divide-slate-100">{data.galleries.map(gallery=><div className="flex items-center justify-between py-4" key={gallery.id}><div><p className="font-medium">{gallery.title}</p><p className="text-xs text-slate-500">{gallery.status} · {formatDate(gallery.created_at)}</p></div><a href={`/g/${gallery.uuid}`} target="_blank" rel="noreferrer" className="rounded-lg p-2 text-violet-600 hover:bg-violet-50" aria-label={`Voir ${gallery.title}`}><ExternalLink className="h-4 w-4"/></a></div>)}{data.galleries.length===0&&<p className="py-10 text-center text-sm text-slate-400">Aucune galerie créée.</p>}</div></article></section>

    <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200"><h2 className="flex items-center gap-2 text-lg font-semibold"><FileText className="h-5 w-5 text-amber-600"/>Factures</h2><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[650px] text-sm"><thead className="border-b text-left text-xs uppercase tracking-wide text-slate-400"><tr><th className="py-3">Numéro</th><th>Date</th><th>Montant</th><th>Payé</th><th>Statut</th></tr></thead><tbody className="divide-y divide-slate-100">{data.invoices.map(invoice=><tr key={invoice.id}><td className="py-4 font-medium">{invoice.invoice_number}</td><td>{formatDate(invoice.issue_date)}</td><td className="tabular-nums">{Number(invoice.total_amount).toLocaleString('fr-FR')} {invoice.currency}</td><td className="tabular-nums">{Number(invoice.amount_paid).toLocaleString('fr-FR')} {invoice.currency}</td><td>{invoice.status}</td></tr>)}</tbody></table>{data.invoices.length===0&&<p className="py-10 text-center text-sm text-slate-400">Aucune facture.</p>}</div></section>

    <section id="securite" className="scroll-mt-20 grid gap-5 xl:grid-cols-2"><article className="rounded-2xl bg-white p-6 ring-1 ring-slate-200"><ShieldCheck className="h-6 w-6 text-emerald-700"/><h2 className="mt-4 text-lg font-semibold">Sécurité du compte</h2><p className="mt-1 text-sm text-slate-500">{data.stats.sessions} session(s) active(s). Chaque intervention exige une justification.</p><Input className="mt-5" value={securityReason} onChange={event=>setSecurityReason(event.target.value)} placeholder="Motif obligatoire"/><div className="mt-3 flex flex-wrap gap-2"><Button variant="outline" onClick={()=>void revokeSessions()}><KeyRound className="mr-2 h-4 w-4"/>Révoquer les sessions</Button>{data.user.email_verified_at?<Button variant="outline" onClick={()=>void setVerification(false)}><MailX className="mr-2 h-4 w-4"/>Retirer la vérification</Button>:<Button variant="outline" onClick={()=>void setVerification(true)}><MailCheck className="mr-2 h-4 w-4"/>Marquer vérifié</Button>}</div></article><article className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200"><CalendarClock className="h-6 w-6 text-slate-700"/><h2 className="mt-4 text-lg font-semibold">Repères opérateur</h2><ul className="mt-4 space-y-3 text-sm text-slate-600"><li>Ne réinitialisez un mot de passe qu’après vérification de l’identité.</li><li>Révoquez les sessions en cas de suspicion ou changement de propriétaire.</li><li>Consignez un motif précis : il apparaît dans le journal d’audit.</li></ul></article></section>

    <section id="profil" className="scroll-mt-20 rounded-2xl bg-white p-6 ring-1 ring-slate-200"><div className="flex items-center gap-3"><UserRoundCog className="h-6 w-6 text-emerald-700"/><div><h2 className="text-lg font-semibold">Modifier le compte</h2><p className="text-sm text-slate-500">Identité, rôle et réinitialisation contrôlée du mot de passe.</p></div></div><div className="mt-6 grid gap-4 md:grid-cols-2"><label className="text-sm font-medium text-slate-700">Nom<Input className="mt-2" value={edit.name} onChange={event=>setEdit({...edit,name:event.target.value})}/></label><label className="text-sm font-medium text-slate-700">Email<Input className="mt-2" type="email" value={edit.email} onChange={event=>setEdit({...edit,email:event.target.value})}/></label><label className="text-sm font-medium text-slate-700">Téléphone<Input className="mt-2" value={edit.phone} onChange={event=>setEdit({...edit,phone:event.target.value})}/></label><label className="text-sm font-medium text-slate-700">Rôle<select className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3" value={edit.role} onChange={event=>setEdit({...edit,role:event.target.value})}><option value="user">Utilisateur</option><option value="admin">Administrateur</option><option value="superadmin">Super Admin</option></select></label><label className="text-sm font-medium text-slate-700">Nouveau mot de passe<Input className="mt-2" type="password" value={edit.password} onChange={event=>setEdit({...edit,password:event.target.value})} placeholder="Laisser vide pour ne pas modifier"/></label><label className="text-sm font-medium text-slate-700">Motif obligatoire<Input className="mt-2" value={edit.reason} onChange={event=>setEdit({...edit,reason:event.target.value})} placeholder="Pourquoi cette modification ?"/></label></div><div className="mt-5 flex justify-end"><Button disabled={saving} onClick={()=>void saveUser()}><Save className="mr-2 h-4 w-4"/>{saving?'Enregistrement…':'Enregistrer et journaliser'}</Button></div></section>

    <section id="historique" className="scroll-mt-20 rounded-2xl bg-white p-6 ring-1 ring-slate-200"><div className="flex items-center gap-3"><History className="h-6 w-6 text-slate-700"/><div><h2 className="text-lg font-semibold">Journal de ce compte</h2><p className="text-sm text-slate-500">25 dernières décisions opérateur.</p></div></div><div className="mt-6 space-y-1">{data.audit_logs.map(log=><article key={log.id} className="grid gap-2 rounded-xl px-4 py-3 transition hover:bg-slate-50 md:grid-cols-[180px_1fr_auto]"><p className="text-xs tabular-nums text-slate-400">{formatDate(log.created_at)}</p><div><p className="text-sm font-semibold text-slate-900">{actionLabels[log.action] ?? log.action}</p><p className="text-xs text-slate-500">{log.reason ?? 'Aucun motif enregistré'}</p></div><p className="text-xs text-slate-400">{log.actor?.name ?? 'Système'}</p></article>)}{data.audit_logs.length===0&&<p className="py-12 text-center text-sm text-slate-400">Aucune action journalisée pour ce compte.</p>}</div></section>
  </main>;
}
