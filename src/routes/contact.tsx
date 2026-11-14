import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent, type ChangeEvent } from "react";
import {
  Phone,
  MapPin,
  Zap,
  FileText,
  Leaf,
  ArrowRight,
  ArrowLeft,
  Check,
  ImagePlus,
  X,
  CheckCircle2,
} from "lucide-react";
import { envoyerDevis } from "@/lib/devis.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Demandez votre devis gratuit — Blondel Jardin" },
      {
        name: "description",
        content: "Demandez votre devis d'entretien ou d'aménagement de jardin en 3 étapes simples.",
      },
    ],
  }),
  component: ContactDevisTunnel,
});

const PRESTATIONS = [
  { id: "Tonte", label: "Tonte", icon: "🌱" },
  { id: "Taille de haies", label: "Taille de haies", icon: "🌳" },
  { id: "Entretien annuel", label: "Entretien annuel", icon: "🍃" },
  { id: "Aménagement", label: "Aménagement", icon: "⛏️" },
  { id: "Plantation", label: "Plantation", icon: "🌿" },
  { id: "Autre", label: "Autre", icon: "💬" },
];

function ContactDevisTunnel() {
  const [etape, setEtape] = useState<1 | 2 | 3>(1);
  const [prestations, setPrestations] = useState<string[]>(["Tonte"]);
  const [photos, setPhotos] = useState<{ nom: string; url: string }[]>([]);

  // Étape 2 : Coordonnées
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [ville, setVille] = useState("");
  const [message, setMessage] = useState("");
  const [erreurTel, setErreurTel] = useState("");

  const [envoi, setEnvoi] = useState(false);
  const [erreurServeur, setErreurServeur] = useState("");
  const envoyerFn = useServerFn(envoyerDevis);

  function togglePrestation(id: string) {
    setPrestations((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  function handlePhotoUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const array = Array.from(files).slice(0, 3 - photos.length);
    const nouvelles = array.map((f) => ({
      nom: f.name,
      url: URL.createObjectURL(f),
    }));
    setPhotos((prev) => [...prev, ...nouvelles]);
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  function passerEtape2() {
    if (prestations.length === 0) {
      alert("Veuillez sélectionner au moins une prestation.");
      return;
    }
    setEtape(2);
    window.scrollTo({ top: 350, behavior: "smooth" });
  }

  async function validerDevis(e: FormEvent) {
    e.preventDefault();
    if (!telephone.trim() || telephone.trim().length < 10) {
      setErreurTel("Veuillez indiquer un numéro de téléphone valide.");
      return;
    }
    setErreurTel("");
    setErreurServeur("");
    setEnvoi(true);

    const messageComplet = [
      ville ? `Commune / secteur : ${ville}` : "",
      message ? `Détails : ${message}` : "",
      photos.length > 0 ? `(${photos.length} photo(s) préparée(s) par le client)` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      await envoyerFn({
        data: {
          id: crypto.randomUUID(),
          nom: nom.trim() || "Client",
          email: email.trim() || "non-renseigne@client.fr",
          telephone: telephone.trim(),
          message: messageComplet || "Demande de devis via formulaire",
          prestations,
          prestationConfirmee: "",
          website: "",
        },
      });
      setEtape(3);
      window.scrollTo({ top: 200, behavior: "smooth" });
    } catch (err) {
      setErreurServeur(err instanceof Error ? err.message : "Erreur lors de l'envoi.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] pb-16 text-foreground">
      {/* 1. HERO PHOTO */}
      <div className="relative overflow-hidden bg-primary px-4 py-16 text-center text-primary-foreground sm:py-20 md:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="relative mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Demandez votre devis
          </h1>
          <p className="mt-4 text-base text-primary-foreground/90 sm:text-lg">
            Un projet d'entretien ou d'aménagement ? Décrivez-nous votre besoin, nous vous répondons rapidement.
          </p>
        </div>
      </div>

      <div className="mx-auto -mt-8 max-w-2xl px-4 sm:px-6">
        {/* 2. STEPPER */}
        <div className="mb-8 flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${etape === 1 ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"}`}
            >
              1
            </span>
            <span className={etape === 1 ? "font-bold text-foreground" : "text-muted-foreground hidden sm:inline"}>
              Mon besoin
            </span>
          </div>
          <span className="h-0.5 w-6 sm:w-12 bg-border" />
          <div className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${etape === 2 ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"}`}
            >
              2
            </span>
            <span className={etape === 2 ? "font-bold text-foreground" : "text-muted-foreground hidden sm:inline"}>
              Mes coordonnées
            </span>
          </div>
          <span className="h-0.5 w-6 sm:w-12 bg-border" />
          <div className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${etape === 3 ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"}`}
            >
              3
            </span>
            <span className={etape === 3 ? "font-bold text-foreground" : "text-muted-foreground hidden sm:inline"}>
              Confirmation
            </span>
          </div>
        </div>

        {/* 3. CARD PRINCIPALE */}
        <div className="rounded-3xl border border-border/60 bg-white p-6 shadow-sm sm:p-10">
          {etape === 1 && (
            <div>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl text-foreground">Quel est votre besoin ?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Sélectionnez la ou les prestations souhaitées.</p>

              {/* Grille PC & Liste Mobile */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {PRESTATIONS.map((p) => {
                  const actif = prestations.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePrestation(p.id)}
                      className={`relative flex items-center justify-between sm:flex-col sm:justify-center gap-3 rounded-2xl border p-4 text-left transition ${
                        actif
                          ? "border-primary bg-[#EBF1E8] text-primary font-semibold shadow-sm"
                          : "border-border/80 bg-background text-foreground hover:border-primary/50"
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl">{p.icon}</span>
                      <span className="text-sm font-medium">{p.label}</span>
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-md border ${actif ? "bg-primary text-white border-primary" : "border-muted-foreground/30 bg-white"}`}
                      >
                        {actif && <Check className="h-3.5 w-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Ajout de photos dès l'étape 1 */}
              <div className="mt-8 rounded-2xl border border-dashed border-border bg-[#FBFBF9] p-4 text-center">
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2">
                  <ImagePlus className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Ajouter des photos du jardin (facultatif)</span>
                  <span className="text-xs text-muted-foreground">
                    Jusqu'à 3 photos pour mieux estimer votre besoin
                  </span>
                  <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                </label>
                {photos.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {photos.map((ph, idx) => (
                      <div key={idx} className="relative h-16 w-16 overflow-hidden rounded-xl border">
                        <img src={ph.url} alt="Aperçu" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={passerEtape2}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
              >
                Continuer <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {etape === 2 && (
            <form onSubmit={validerDevis}>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl text-foreground">Vos coordonnées</h2>
              <p className="mt-1 text-sm text-muted-foreground">Où et comment pouvons-nous vous joindre ?</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Téléphone <span className="text-red-500">* (obligatoire)</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="06 12 34 56 78"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  {erreurTel && <p className="mt-1 text-xs text-red-500">{erreurTel}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Nom & Prénom
                  </label>
                  <input
                    type="text"
                    placeholder="M. ou Mme..."
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Ville ou code postal
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Hérin, Valenciennes..."
                      value={ville}
                      onChange={(e) => setVille(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      E-mail (facultatif)
                    </label>
                    <input
                      type="email"
                      placeholder="votre@email.fr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Précisions sur votre terrain
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Longueur de haie approximative, surface, accès..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary"
                  />
                </div>
              </div>

              {erreurServeur && <p className="mt-4 text-sm text-red-500">{erreurServeur}</p>}

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEtape(1)}
                  className="flex items-center justify-center gap-2 rounded-full border border-border px-6 py-4 text-sm font-semibold transition hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4" /> Retour
                </button>
                <button
                  type="submit"
                  disabled={envoi}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-4 text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 disabled:opacity-50"
                >
                  {envoi ? "Envoi en cours..." : "Envoyer ma demande"}
                </button>
              </div>
            </form>
          )}

          {etape === 3 && (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF1E8] text-primary">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-foreground">Demande bien reçue !</h2>
              <p className="mt-2 text-muted-foreground">
                Merci. Blondel Jardin étudie votre demande et vous rappelle au{" "}
                <strong className="text-foreground">{telephone}</strong> sous 24 h.
              </p>
              <div className="mt-6 rounded-2xl bg-[#F7F5F0] p-4 text-left text-sm">
                <p className="font-semibold text-foreground">Prestations demandées :</p>
                <p className="mt-1 text-muted-foreground">{prestations.join(", ")}</p>
              </div>
            </div>
          )}
        </div>

        {/* 4. BADGES DE RÉASSURANCE */}
        <div className="mt-8 grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
            <Zap className="h-4 w-4 text-primary" /> Réponse sous 24 h
          </div>
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
            <FileText className="h-4 w-4 text-primary" /> Devis gratuit
          </div>
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
            <Leaf className="h-4 w-4 text-primary" /> Sans engagement
          </div>
        </div>

        {/* 5. BANDEAU COORDONNÉES */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl bg-primary px-6 py-5 text-primary-foreground shadow-md">
          <a href="tel:+33783551969" className="flex items-center gap-3 font-semibold hover:opacity-90">
            <Phone className="h-5 w-5" /> 07 83 55 19 69
          </a>
          <span className="hidden sm:inline text-primary-foreground/30">|</span>
          <div className="flex items-center gap-3 text-sm text-primary-foreground/90">
            <MapPin className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium">Hérin (59)</p>
              <p className="text-xs text-primary-foreground/75">+50 km autour de Valenciennes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
