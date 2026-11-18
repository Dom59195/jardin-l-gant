import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Upload, LogOut, CheckCircle2 } from "lucide-react";
import { AdminDevis } from "@/components/admin-devis";
import { estVideo } from "@/lib/media";

export const Route = createFileRoute("/admin")({
  staticData: { sitemap: "exclude-subtree" },
  head: () => ({
    meta: [
      { title: "Administration — Blondel Jardin" },
      { name: "description", content: "Espace de gestion des réalisations de Blondel Jardin." },
      { property: "og:title", content: "Administration — Blondel Jardin" },
      { property: "og:description", content: "Espace de gestion des réalisations de Blondel Jardin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Etape = { jour: string; texte: string };

type ProjetDB = {
  id: string;
  titre: string;
  lieu: string;
  type: string;
  description: string | null;
  duree: string | null;
  surface: string | null;
  etapes: Etape[] | null;
  resultat: string | null;
  img: string;
  photos: string[];
  ordre: number;
};

function AdminPage() {
  const [session, setSession] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Projets
  const [projets, setProjets] = useState<ProjetDB[]>([]);
  const [chargement, setChargement] = useState(true);

  // Formulaire d'ajout
  const [titre, setTitre] = useState("");
  const [lieu, setLieu] = useState("Hérin (59)");
  const [type, setType] = useState("Entretien");
  const [description, setDescription] = useState("");
  const [duree, setDuree] = useState("");
  const [surface, setSurface] = useState("");
  const [resultat, setResultat] = useState("");
  const [etapes, setEtapes] = useState<Etape[]>([{ jour: "Étape 1", texte: "" }]);
  const [photosUrls, setPhotosUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session);
      if (data.session) chargerProjets();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(!!sess);
      if (sess) chargerProjets();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function chargerProjets() {
    setChargement(true);
    const { data } = await (supabase as any).from("projets").select("*").order("ordre", { ascending: true });
    if (data) setProjets(data as unknown as ProjetDB[]);
    setChargement(false);
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoadingAuth(true);
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
    setLoadingAuth(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(false);
  }

  async function handleUploadPhoto(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    const nouvellesUrls: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const nom = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      const { data, error } = await supabase.storage.from("projets").upload(nom, file);
      if (!error && data) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("projets").getPublicUrl(data.path);
        nouvellesUrls.push(publicUrl);
      }
    }

    setPhotosUrls((prec) => [...prec, ...nouvellesUrls]);
    setUploading(false);
  }

  async function handleCreerProjet(e: FormEvent) {
    e.preventDefault();
    const couverture = photosUrls.find((u) => !estVideo(u));
    if (!titre.trim() || !couverture) {
      alert("Veuillez indiquer un titre et ajouter au moins une photo (elle servira de couverture).");
      return;
    }
    setSubmitting(true);

    const nouveau = {
      titre,
      lieu,
      type,
      description,
      duree: null,
      surface: null,
      resultat: null,
      etapes: [],
      img: couverture,
      photos: photosUrls,
      ordre: projets.length,
    };

    const { error } = await (supabase as any).from("projets").insert([nouveau]);
    if (!error) {
      setSuccessMsg("Projet publié avec succès sur le site !");
      setTimeout(() => setSuccessMsg(null), 4000);
      setTitre("");
      setDescription("");
      setDuree("");
      setSurface("");
      setResultat("");
      setEtapes([{ jour: "Étape 1", texte: "" }]);
      setPhotosUrls([]);
      chargerProjets();
    } else {
      alert(`Erreur : ${error.message}`);
    }
    setSubmitting(false);
  }

  async function handleSupprimerProjet(id: string) {
    if (!confirm("Voulez-vous vraiment supprimer ce projet ?")) return;
    await (supabase as any).from("projets").delete().eq("id", id);
    chargerProjets();
  }

  if (!session) {
    return (
      <section className="mx-auto max-w-md px-6 py-24">
        <div className="rounded-3xl border border-border bg-background p-8 shadow-sm">
          <p className="eyebrow text-moss">Espace réservé</p>
          <h1 className="mt-2 font-display text-3xl text-primary">Connexion Admin</h1>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 rounded-xl"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Mot de passe</label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 rounded-xl"
              />
            </div>
            {authError && <p className="text-sm text-destructive">{authError}</p>}
            <Button type="submit" disabled={loadingAuth} className="w-full rounded-full bg-primary text-white">
              {loadingAuth ? "Connexion…" : "Se connecter"}
            </Button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="eyebrow text-moss">Administration</p>
          <h1 className="font-display text-4xl text-primary">Gestion des chantiers</h1>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2 rounded-full">
          <LogOut className="h-4 w-4" /> Déconnexion
        </Button>
      </div>

      {successMsg && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-moss/10 p-4 text-moss">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {/* Formulaire d'ajout avec prévisualisation en direct */}
      <AdminDevis />
      <div className="mt-10 rounded-3xl border border-border bg-background p-6 md:p-8">
        <h2 className="font-display text-2xl text-primary">Nouveau projet en 3 clics</h2>
        <p className="mt-1 text-sm text-muted-foreground">Photos, titre, catégorie… c'est tout.</p>

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-12">
          {/* Colonne gauche : Le formulaire */}
          <form onSubmit={handleCreerProjet} className="space-y-6 lg:col-span-7">
            <div>
              <p className="text-sm font-medium">1. Photos et vidéos *</p>
              <div className="mt-2 flex flex-wrap gap-3">
                {photosUrls.map((url, i) => (
                  <div key={url} className="relative h-24 w-24 overflow-hidden rounded-xl border border-border">
                    {estVideo(url) ? (
                      <video src={url} muted playsInline className="h-full w-full object-cover" />
                    ) : (
                      <img src={url} alt={`Aperçu ${i + 1}`} className="h-full w-full object-cover" />
                    )}
                    {url === photosUrls.find((u) => !estVideo(u)) && (
                      <span className="absolute bottom-1 left-1 rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">
                        Principale
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setPhotosUrls((p) => p.filter((_, idx) => idx !== i))}
                      className="absolute right-1 top-1 rounded-full bg-primary/80 px-1.5 text-xs text-primary-foreground hover:bg-destructive"
                      aria-label="Retirer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 transition hover:bg-muted">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="mt-1 text-xs text-muted-foreground">{uploading ? "Envoi…" : "Ajouter"}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleUploadPhoto}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">2. Titre *</label>
              <Input
                placeholder="ex : Taille de haies"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                className="mt-1 rounded-xl"
                required
              />
            </div>

            <div>
              <p className="text-sm font-medium">3. Catégorie</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Taille de haie", "Débroussaillage", "Tonte", "Aménagement", "Entretien"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setType(cat)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      type === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <details className="rounded-2xl bg-muted/40 p-4">
              <summary className="cursor-pointer text-sm font-medium">Plus de détails (facultatif)</summary>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">Lieu</label>
                  <Input value={lieu} onChange={(e) => setLieu(e.target.value)} className="mt-1 rounded-xl" />
                </div>
                <div>
                  <label className="text-sm font-medium">Autre catégorie</label>
                  <Input value={type} onChange={(e) => setType(e.target.value)} className="mt-1 rounded-xl" />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Quelques mots sur le chantier…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 rounded-xl"
                    rows={3}
                  />
                </div>
              </div>
            </details>

            <Button
              type="submit"
              disabled={submitting || uploading}
              className="w-full rounded-full bg-primary px-8 text-primary-foreground sm:w-auto"
            >
              {submitting ? "Publication…" : "Publier"}
            </Button>
          </form>

          {/* Colonne droite : Prévisualisation en direct (comme un banc de montage) */}
          <div className="lg:col-span-5">
            <div className="sticky top-6 rounded-2xl border border-border bg-muted/30 p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Aperçu en direct
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-moss/10 px-2.5 py-0.5 text-[11px] font-medium text-moss">
                  <span className="h-1.5 w-1.5 rounded-full bg-moss animate-pulse" />
                  Rendu sur le site
                </span>
              </div>

              {/* Carte fidèle à la page Projets */}
              <div className="overflow-hidden rounded-2xl border border-border bg-background p-4 shadow-sm">
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-muted">
                  {photosUrls.length > 0 ? (
                    estVideo(photosUrls.find((u) => !estVideo(u)) || photosUrls[0]) ? (
                      <video
                        src={photosUrls.find((u) => !estVideo(u)) || photosUrls[0]}
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={photosUrls.find((u) => !estVideo(u)) || photosUrls[0]}
                        alt="Aperçu couverture"
                        className="h-full w-full object-cover"
                      />
                    )
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-muted-foreground">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted-foreground/10 text-xl">
                        🌿
                      </div>
                      <p className="mt-2 text-xs font-medium">Votre photo de couverture apparaîtra ici</p>
                    </div>
                  )}

                  {photosUrls.length > 1 && (
                    <span className="absolute bottom-2 right-2 rounded-full bg-primary/80 px-2.5 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm">
                      +{photosUrls.length - 1} média{photosUrls.length > 2 ? "s" : ""}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <h3 className="truncate font-display text-2xl text-primary">{titre.trim() || "Titre du projet"}</h3>
                  <span className="shrink-0 text-xs font-medium text-moss">{lieu.trim() || "Hérin & environs"}</span>
                </div>

                <p className="mt-1 text-xs text-muted-foreground">{type.trim() || "Catégorie"}</p>

                {description.trim() && (
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {description.trim()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des chantiers existants */}
      <div className="mt-12">
        <h2 className="font-display text-2xl text-primary">Projets en ligne ({projets.length})</h2>
        {chargement ? (
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        ) : projets.length === 0 ? (
          <p className="mt-4 text-muted-foreground">Aucun projet en ligne pour le moment.</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {projets.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4"
              >
                <img src={p.img} alt={p.titre} className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="truncate font-semibold text-primary">{p.titre}</h3>
                  <p className="text-xs text-muted-foreground">
                    {p.lieu} · {p.photos.length} média(s)
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSupprimerProjet(p.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
