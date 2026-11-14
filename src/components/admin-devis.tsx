import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

type Devis = Database["public"]["Tables"]["contact_submissions"]["Row"];

export function AdminDevis() {
  const [devis, setDevis] = useState<Devis[]>([]);
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(true);
  async function charger() {
    setLoading(true);
    setErreur("");
    const { data: roles, error: roleError } = await supabase.from("user_roles").select("role").eq("role", "admin");
    if (roleError || !roles?.length) {
      setErreur("La consultation des demandes est réservée au compte propriétaire confirmé.");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    if (error) setErreur("Impossible de charger les demandes.");
    else setDevis(data ?? []);
    setLoading(false);
  }
  useEffect(() => { void charger(); }, []);
  return (
    <section className="mt-10 border-b border-border pb-10">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl text-primary">Demandes de devis</h2>
        <Button variant="outline" size="icon" onClick={charger} disabled={loading} aria-label="Actualiser les demandes" title="Actualiser les demandes"><RefreshCw /></Button>
      </div>
      {loading ? <p className="mt-4 text-muted-foreground">Chargement…</p> : erreur ? <p role="alert" className="mt-4 text-destructive">{erreur}</p> : devis.length === 0 ? <p className="mt-4 text-muted-foreground">Aucune demande pour le moment.</p> : (
        <div className="mt-6 space-y-6">
          {devis.map((d) => <article key={d.id} className="border-t border-border pt-6">
            <div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold text-primary">{d.nom}</h3><time className="text-sm text-muted-foreground">{new Date(d.created_at).toLocaleString("fr-FR")}</time></div>
            <a className="mt-2 block break-all text-moss underline" href={`mailto:${d.email}`}>{d.email}</a>
            {d.telephone && <a className="mt-1 block text-primary" href={`tel:${d.telephone}`}>{d.telephone}</a>}
            {d.prestations.length > 0 && <p className="mt-3 text-sm text-moss">{d.prestations.join(" · ")}</p>}
            {d.prestation_confirmee && <p className="mt-2 text-sm text-muted-foreground">Prestation confirmée : {d.prestation_confirmee}</p>}
            <p className="mt-3 whitespace-pre-wrap break-words text-foreground">{d.message}</p>
          </article>)}
        </div>
      )}
    </section>
  );
}