import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardList,
  FileText,
  ImagePlus,
  Leaf,
  Scissors,
  Sprout,
  Trees,
  X,
  Zap,
} from "lucide-react";
import brandLogo from "@/assets/logo-blondel-jardin-detoure.png.asset.json";
import { envoyerDevis } from "@/lib/devis.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Demandez votre devis gratuit — Blondel Jardin" },
      {
        name: "description",
        content: "Décrivez votre projet de jardin et recevez un devis personnalisé.",
      },
    ],
  }),
  component: ContactDevisTunnel,
});

const PRESTATIONS = [
  { id: "Tonte", label: "Tonte", Icon: Scissors },
  { id: "Taille de haies", label: "Taille de haies", Icon: Trees },
  { id: "Entretien annuel", label: "Entretien annuel", Icon: Leaf },
  { id: "Aménagement", label: "Aménagement", Icon: Sprout },
  { id: "Plantation", label: "Plantation", Icon: Leaf },
  { id: "Autre", label: "Autre", Icon: ClipboardList },
] as const;
type Etape = 1 | 2 | 3 | "confirmation";
const inputClass =
  "mt-2 w-full rounded-lg border border-[#D8D5CA] bg-[#FFFDF8] px-3.5 py-3 text-base text-[#0B2B1C] outline-none transition placeholder:text-[#778076] focus:border-[#0B2B1C] focus:ring-1 focus:ring-[#0B2B1C]";
const SURFACES_PELOUSE = [
  "Moins de 100 m²",
  "100 à 300 m²",
  "300 à 500 m²",
  "500 à 1 000 m²",
  "1 000 à 2 000 m²",
  "Plus de 2 000 m²",
];
const LONGUEURS_HAIES = [
  "Moins de 5 mètres linéaires",
  "5 à 10 mètres linéaires",
  "10 à 20 mètres linéaires",
  "20 à 30 mètres linéaires",
  "30 à 50 mètres linéaires",
  "50 à 100 mètres linéaires",
  "Plus de 100 mètres linéaires",
];
const SURFACES_PROJET = [
  "Moins de 100 m²",
  "100 à 300 m²",
  "300 à 500 m²",
  "500 à 1 000 m²",
  "Plus de 1 000 m²",
];
const SURFACES_ENTRETIEN = [...SURFACES_PELOUSE, "Je ne sais pas"];
const LONGUEURS_ENTRETIEN = [...LONGUEURS_HAIES, "Je ne sais pas"];
const VEGETAUX = [
  "Moins de 10 végétaux",
  "10 à 25 végétaux",
  "25 à 50 végétaux",
  "Plus de 50 végétaux",
];
type InformationProjet =
  "pelouse" | "haies" | "plantation" | "amenagement" | "entretien" | "entretienLongueur";
type Erreurs = {
  prestations?: string;
  nom?: string;
  telephone?: string;
  email?: string;
  message?: string;
};

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-[#183326]">
      {label}
      {required && <span className="ml-1 text-[#B84333]">*</span>}
      {children}
    </label>
  );
}

function ContactDevisTunnel() {
  const [etape, setEtape] = useState<Etape>(1);
  const [prestations, setPrestations] = useState<string[]>([]);
  const [photos, setPhotos] = useState<{ nom: string; url: string }[]>([]);
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [ville, setVille] = useState("");
  const [informationsProjet, setInformationsProjet] = useState<Record<InformationProjet, string>>({
    pelouse: "",
    haies: "",
    plantation: "",
    amenagement: "",
    entretien: "",
    entretienLongueur: "",
  });
  const [message, setMessage] = useState("");
  const [erreurs, setErreurs] = useState<Erreurs>({});
  const [erreurServeur, setErreurServeur] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const envoyerFn = useServerFn(envoyerDevis);
  const etapeVisible = etape === "confirmation" ? 3 : etape;
  const champsProjet = [
    prestations.includes("Tonte") && {
      id: "pelouse" as const,
      label:
        prestations.length === 1
          ? "Quelle est la surface de votre pelouse ?"
          : "Surface de la pelouse (m²)",
      recap: "Surface de la pelouse",
      options: SURFACES_PELOUSE,
    },
    prestations.includes("Taille de haies") && {
      id: "haies" as const,
      label:
        prestations.length === 1
          ? "Quelle est la longueur de votre haie ?"
          : "Longueur des haies (ml)",
      recap: "Longueur des haies",
      options: LONGUEURS_HAIES,
    },
    prestations.includes("Plantation") && {
      id: "plantation" as const,
      label: "Nombre approximatif de végétaux à planter",
      recap: "Végétaux à planter",
      options: VEGETAUX,
    },
    prestations.includes("Aménagement") && {
      id: "amenagement" as const,
      label: "Surface approximative de la zone à aménager (m²)",
      recap: "Zone à aménager",
      options: SURFACES_PROJET,
    },
    prestations.includes("Entretien annuel") && {
      id: "entretien" as const,
      label: "Quelle est la surface approximative de votre jardin ?",
      recap: "Surface du jardin",
      options: SURFACES_ENTRETIEN,
    },
    prestations.includes("Entretien annuel") && {
      id: "entretienLongueur" as const,
      label: "Quelle est la longueur approximative de vos haies et bordures ?",
      recap: "Longueur des haies et bordures",
      options: LONGUEURS_ENTRETIEN,
    },
  ].filter(Boolean) as { id: InformationProjet; label: string; recap: string; options: string[] }[];
  const togglePrestation = (id: string) =>
    setPrestations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );

  function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    const fichiers = Array.from(event.target.files).slice(0, 3 - photos.length);
    setPhotos((prev) => [
      ...prev,
      ...fichiers.map((file) => ({ nom: file.name, url: URL.createObjectURL(file) })),
    ]);
    event.target.value = "";
  }
  function removePhoto(index: number) {
    const photo = photos[index];
    if (photo) URL.revokeObjectURL(photo.url);
    setPhotos((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }
  function versEtapeDeux() {
    if (!prestations.length) {
      setErreurs({ prestations: "Sélectionnez au moins une prestation." });
      return;
    }
    setErreurs({});
    setEtape(2);
  }
  function versRecapitulatif(event: FormEvent) {
    event.preventDefault();
    const next: Erreurs = {};
    if (!nom.trim()) next.nom = "Indiquez votre nom et prénom.";
    if (telephone.trim().length < 10) next.telephone = "Indiquez un numéro de téléphone valide.";
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim()))
      next.email = "Indiquez une adresse e-mail valide.";
    if (message.trim().length > 900)
      next.message = "Votre description est trop longue (900 caractères maximum).";
    if (Object.keys(next).length) {
      setErreurs(next);
      return;
    }
    setErreurs({});
    setEtape(3);
  }
  async function validerDevis() {
    setErreurServeur("");
    setEnvoi(true);
    const messageComplet = [
      ville && `Commune / secteur : ${ville.trim()}`,
      ...champsProjet
        .filter((champ) => informationsProjet[champ.id])
        .map((champ) => `${champ.recap} : ${informationsProjet[champ.id]}`),
      message && `Description du projet : ${message.trim()}`,
      photos.length && `Photos sélectionnées pour l'aperçu : ${photos.length} (non transmises)`,
    ]
      .filter(Boolean)
      .join("\n\n");
    try {
      await envoyerFn({
        data: {
          id: crypto.randomUUID(),
          nom: nom.trim(),
          email: email.trim() || "non-renseigne@client.fr",
          telephone: telephone.trim(),
          message: messageComplet || "Demande de devis via formulaire",
          prestations,
          prestationConfirmee: "",
          website: "",
        },
      });
      setEtape("confirmation");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setErreurServeur(
        error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi.",
      );
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="bg-[#F3ECD9] px-3 pb-2 pt-5 text-[#0B2B1C] sm:px-6 sm:pb-5 sm:pt-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-[#D8D5CA] bg-[#FFFDF8] lg:grid lg:min-h-[700px] lg:grid-cols-[0.88fr_1.12fr]">
        <aside className="relative overflow-hidden bg-[#0B2B1C] px-6 py-8 text-[#F3ECD9] sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <svg
            aria-hidden="true"
            viewBox="0 0 360 560"
            className="pointer-events-none absolute -right-28 top-20 h-[32rem] w-[23rem] text-[#B6C99B]/20"
            fill="none"
          >
            <path
              d="M296 8C215 117 211 217 260 327c25 57 18 125-50 214"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <path
              d="M256 123c-62-4-100 19-132 70 61 4 102-16 132-70Z"
              stroke="currentColor"
              strokeWidth="1.1"
            />
            <path
              d="M266 230c50-36 92-41 132-20-48 38-92 45-132 20Z"
              stroke="currentColor"
              strokeWidth="1.1"
            />
            <path
              d="M250 343c-59-11-101 8-137 53 57 11 103-5 137-53Z"
              stroke="currentColor"
              strokeWidth="1.1"
            />
          </svg>
          <svg
            aria-hidden="true"
            viewBox="0 0 160 160"
            className="pointer-events-none absolute -bottom-14 -left-12 h-48 w-48 text-[#F3ECD9]/10"
            fill="none"
          >
            <path
              d="M12 151C40 88 85 45 150 10M46 121c-2-28 9-45 34-54M77 89c25 1 42-10 54-35"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
          <div className="relative flex h-full min-h-[29rem] flex-col sm:min-h-[32rem]">
            <img
              src={brandLogo.url}
              alt="Blondel Jardin"
              width={150}
              height={82}
              className="h-auto w-28 object-contain sm:w-32"
            />
            <div className="mt-16 max-w-sm sm:mt-20 lg:mt-24">
              <p className="text-xs font-semibold tracking-[0.22em] text-[#B6C99B] uppercase">
                Blondel Jardin
              </p>
              <h1 className="mt-4 max-w-[22rem] font-display text-[2rem] leading-[1.08] sm:text-[2.65rem]">
                Votre jardin,
                <br />
                <span className="whitespace-nowrap">notre savoir-faire.</span>
              </h1>
              <p className="mt-6 max-w-[18rem] text-sm leading-6 text-[#F3ECD9]/75">
                Nous entretenons et aménageons vos espaces extérieurs avec soin, passion et
                savoir-faire.
              </p>
            </div>
          </div>
        </aside>
        <section className="px-5 py-7 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <ol className="mb-9 grid grid-cols-3 gap-2" aria-label="Progression du formulaire">
            {["Mon besoin", "Mes informations", "Confirmation"].map((label, index) => {
              const number = index + 1;
              const complete = etapeVisible > number;
              const current = etapeVisible === number;
              return (
                <li key={label} className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-300 ${complete || current ? "bg-[#0B2B1C] text-[#F3ECD9]" : "border border-[#D8D5CA] text-[#778076]"}`}
                    >
                      {complete ? <Check className="h-3.5 w-3.5" /> : number}
                    </span>
                    <span
                      className={`hidden text-xs font-semibold transition-colors duration-300 sm:inline ${current ? "text-[#0B2B1C]" : complete ? "text-[#52704F]" : "text-[#778076]"}`}
                    >
                      {label}
                    </span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#E5E2D8]">
                    <div
                      className={`h-full rounded-full bg-[#0B2B1C] transition-all duration-500 ease-out ${complete ? "w-full" : current ? "w-1/2" : "w-0"}`}
                    />
                  </div>
                </li>
              );
            })}
          </ol>
          {etape === 1 && (
            <div>
              <h2 className="font-display text-3xl">Quel est votre besoin ?</h2>
              <p className="mt-2 text-sm text-[#647064]">
                Sélectionnez les prestations qui vous intéressent.
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {PRESTATIONS.map(({ id, label, Icon }) => {
                  const selected = prestations.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        togglePrestation(id);
                        setErreurs({});
                      }}
                      className={`relative flex min-h-24 w-full items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 sm:min-h-32 sm:flex-col sm:items-start sm:justify-between ${selected ? "border-2 border-[#0B2B1C] bg-[#E8F0E4]" : "border-[#D8D5CA] bg-[#FFFDF8] hover:border-[#8A9B7A] hover:bg-[#FAF9F3]"}`}
                    >
                      <Icon className="h-5 w-5 shrink-0 text-[#31543A]" />
                      <span className="flex-1 text-sm font-semibold sm:pr-6">{label}</span>
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all duration-200 sm:absolute sm:right-4 sm:top-4 ${selected ? "border-[#0B2B1C] bg-[#0B2B1C] text-white" : "border-[#B7B9AF] bg-white"}`}
                      >
                        {selected && <Check className="h-3.5 w-3.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
              {erreurs.prestations && (
                <p role="alert" className="mt-3 text-sm text-[#B84333]">
                  {erreurs.prestations}
                </p>
              )}
              <button
                type="button"
                onClick={versEtapeDeux}
                className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0B2B1C] px-5 py-3.5 font-semibold text-[#F3ECD9] transition hover:bg-[#183D29]"
              >
                Continuer <ArrowRight className="h-4 w-4" />
              </button>
              <div className="mt-7 grid grid-cols-3 gap-2 text-center text-[11px] font-medium leading-4 text-[#647064] sm:mt-8 sm:text-xs">
                <div className="flex flex-col items-center gap-2 px-1">
                  <Zap className="h-4 w-4 text-[#31543A]" aria-hidden />
                  <span>Réponse sous 24 h</span>
                </div>
                <div className="flex flex-col items-center gap-2 px-1">
                  <FileText className="h-4 w-4 text-[#31543A]" aria-hidden />
                  <span>Devis gratuit</span>
                </div>
                <div className="flex flex-col items-center gap-2 px-1">
                  <Leaf className="h-4 w-4 text-[#31543A]" aria-hidden />
                  <span>Sans engagement</span>
                </div>
              </div>
            </div>
          )}
          {etape === 2 && (
            <form onSubmit={versRecapitulatif} noValidate>
              <h2 className="font-display text-3xl">Vos informations</h2>
              <p className="mt-2 text-sm text-[#647064]">
                Les champs marqués d’un astérisque sont nécessaires.
              </p>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div>
                  <Field label="Nom et prénom" required>
                    <input
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className={inputClass}
                      autoComplete="name"
                    />
                  </Field>
                  {erreurs.nom && (
                    <p role="alert" className="mt-1 text-xs text-[#B84333]">
                      {erreurs.nom}
                    </p>
                  )}
                </div>
                <div>
                  <Field label="Téléphone" required>
                    <input
                      type="tel"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      className={inputClass}
                      placeholder="06 12 34 56 78"
                      autoComplete="tel"
                    />
                  </Field>
                  <p className="mt-1 text-xs text-[#778076]">Format : 06 12 34 56 78</p>
                  {erreurs.telephone && (
                    <p role="alert" className="mt-1 text-xs text-[#B84333]">
                      {erreurs.telephone}
                    </p>
                  )}
                </div>
                <div>
                  <Field label="Adresse e-mail">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                      placeholder="vous@exemple.fr"
                      autoComplete="email"
                    />
                  </Field>
                  {erreurs.email && (
                    <p role="alert" className="mt-1 text-xs text-[#B84333]">
                      {erreurs.email}
                    </p>
                  )}
                </div>
                <Field label="Ville / code postal">
                  <input
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    className={inputClass}
                    placeholder="Ex. 59195 ou Hérin"
                    autoComplete="postal-code"
                  />
                </Field>
                {champsProjet.map((champ) => (
                  <Field key={champ.id} label={champ.label}>
                    <select
                      value={informationsProjet[champ.id]}
                      onChange={(e) =>
                        setInformationsProjet((prev) => ({ ...prev, [champ.id]: e.target.value }))
                      }
                      className={inputClass}
                    >
                      <option value="">Choisir une réponse</option>
                      {champ.options.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </Field>
                ))}
                <div className="sm:col-span-2">
                  <Field label="Description du projet">
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={inputClass}
                      placeholder="Exemple : Je souhaite faire tailler une haie de 30 mètres et entretenir ma pelouse."
                    />
                  </Field>
                  <p className="mt-1 text-xs text-[#778076]">
                    Précisez si vous le souhaitez les accès, dimensions ou contraintes du terrain.
                  </p>
                  {erreurs.message && (
                    <p role="alert" className="mt-1 text-xs text-[#B84333]">
                      {erreurs.message}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2 rounded-xl border border-dashed border-[#AAB6A2] bg-[#F8F6EE] p-4 transition-colors hover:border-[#52704F]">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg p-1">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E5EEDC] text-[#31543A]">
                      <ImagePlus className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">
                        Ajouter des photos du jardin
                      </span>
                      <span className="block text-xs text-[#647064]">
                        Jusqu’à 3 photos · elles restent uniquement visibles dans votre navigateur
                        et ne sont pas envoyées.
                      </span>
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="sr-only"
                    />
                  </label>
                  {photos.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3 border-t border-[#D8D5CA] pt-4">
                      {photos.map((photo, index) => (
                        <div
                          key={photo.url}
                          className="relative h-20 w-20 overflow-hidden rounded-lg border border-[#D8D5CA] bg-white"
                        >
                          <img
                            src={photo.url}
                            alt={`Aperçu ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            aria-label={`Supprimer ${photo.nom}`}
                            className="absolute right-1 top-1 rounded-md bg-[#0B2B1C]/85 p-1 text-white transition hover:bg-[#0B2B1C]"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEtape(1)}
                  className="flex min-h-12 items-center gap-2 rounded-lg border border-[#BFC5B5] px-4 font-semibold text-[#183326]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </button>
                <button
                  type="submit"
                  className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#0B2B1C] px-5 font-semibold text-[#F3ECD9]"
                >
                  Continuer <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
          {etape === 3 && (
            <div>
              <h2 className="font-display text-3xl">Vérifiez votre demande</h2>
              <p className="mt-2 text-sm text-[#647064]">
                Tout est prêt. Vous pourrez encore revenir en arrière si nécessaire.
              </p>
              <div className="mt-7 space-y-5 rounded-xl border border-[#D8D5CA] bg-[#F8F6EE] p-5 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#647064]">
                    Prestations
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {prestations.map((prestation) => (
                      <span
                        key={prestation}
                        className="rounded-full border border-[#B9C9B4] bg-[#EDF1E6] px-3 py-1 text-xs font-semibold text-[#31543A]"
                      >
                        {prestation}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-[#D8D5CA] pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#647064]">
                    Coordonnées
                  </p>
                  <dl className="mt-2 grid gap-x-5 gap-y-1 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs text-[#778076]">Nom</dt>
                      <dd className="font-semibold">{nom}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[#778076]">Téléphone</dt>
                      <dd className="font-semibold">{telephone}</dd>
                    </div>
                    {email && (
                      <div>
                        <dt className="text-xs text-[#778076]">E-mail</dt>
                        <dd>{email}</dd>
                      </div>
                    )}
                    {ville && (
                      <div>
                        <dt className="text-xs text-[#778076]">Ville / code postal</dt>
                        <dd>{ville}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                {(champsProjet.some((champ) => informationsProjet[champ.id]) || message) && (
                  <div className="border-t border-[#D8D5CA] pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#647064]">
                      Votre projet
                    </p>
                    {champsProjet
                      .filter((champ) => informationsProjet[champ.id])
                      .map((champ) => (
                        <p key={champ.id} className="mt-2">
                          <span className="font-medium">{champ.recap} :</span>{" "}
                          {informationsProjet[champ.id]}
                        </p>
                      ))}
                    {message && <p className="mt-1 whitespace-pre-wrap">{message}</p>}
                  </div>
                )}
                {photos.length > 0 && (
                  <p className="border-t border-[#D8D5CA] pt-4 text-xs text-[#647064]">
                    {photos.length} photo(s) sélectionnée(s) pour l’aperçu, non transmises.
                  </p>
                )}
              </div>
              {erreurServeur && (
                <p role="alert" className="mt-4 rounded-lg bg-[#FBE9E5] p-3 text-sm text-[#8F3024]">
                  {erreurServeur}
                </p>
              )}
              <p className="mt-6 border-l-2 border-[#B9C9B4] pl-3 text-xs leading-5 text-[#647064]">
                Votre demande est gratuite et sans engagement. Vos informations sont utilisées
                uniquement pour étudier votre projet et vous recontacter à ce sujet.
              </p>
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEtape(2)}
                  disabled={envoi}
                  className="flex min-h-12 items-center gap-2 rounded-lg border border-[#BFC5B5] px-4 font-semibold disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </button>
                <button
                  type="button"
                  onClick={validerDevis}
                  disabled={envoi}
                  className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#0B2B1C] px-5 font-semibold text-[#F3ECD9] disabled:opacity-60"
                >
                  {envoi ? "Envoi en cours…" : "Envoyer ma demande"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          {etape === "confirmation" && (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E5EEDC] text-[#0B2B1C]">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <p className="mt-6 text-xs font-semibold tracking-[0.16em] text-[#52704F]">
                DEMANDE ENREGISTRÉE
              </p>
              <h2 className="mt-3 font-display text-3xl">Merci, {nom}.</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#647064]">
                Votre demande a bien été reçue. Blondel Jardin vous recontactera au{" "}
                <strong className="font-semibold text-[#183326]">{telephone}</strong> sous 24 h.
              </p>
              <div className="mx-auto mt-7 max-w-md rounded-xl border border-[#D8D5CA] bg-[#F8F6EE] p-4 text-left text-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#647064]">
                  Prestations demandées
                </p>
                <p className="mt-1 font-semibold">{prestations.join(" · ")}</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
