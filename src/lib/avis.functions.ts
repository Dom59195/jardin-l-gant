import { createServerFn } from "@tanstack/react-start";
import { nettoyerAvis } from "@/lib/avis-texte";

export type Avis = { nom: string; photo?: string | undefined; note: number; texte: string; date: string };
export type AvisData = { note: number; total: number; avis: Avis[]; lien: string; laisserAvis: string };

const ACCOUNT = "108270569088880212657";
const LOCATION = "17056257500298191542";
const LIEN = "https://maps.google.com/maps?cid=5668026938302086635";
const LAISSER = "https://search.google.com/local/writereview?placeid=ChIJa1tn6lOY5kQR6z3XSnjgqE4";
const STARS: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

let cache: { at: number; data: AvisData } | null = null;

export const getAvisGoogle = createServerFn({ method: "GET" }).handler(async (): Promise<AvisData | null> => {
  if (cache && Date.now() - cache.at < 60 * 60 * 1000) return cache.data;
  const lovable = process.env["LOVABLE_API_KEY"];
  const key = process.env["GOOGLE_BUSINESS_PROFILE_API_KEY"];
  if (!lovable || !key) return cache?.data ?? null;
  try {
    const res = await fetch(
      `https://connector-gateway.lovable.dev/google_business_profile/my_business/v4/accounts/${ACCOUNT}/locations/${LOCATION}/reviews?pageSize=50`,
      { headers: { Authorization: `Bearer ${lovable}`, "X-Connection-Api-Key": key } },
    );
    if (!res.ok) {
      console.error(`Avis Google [${res.status}]: ${await res.text()}`);
      return cache?.data ?? null;
    }
    const json = (await res.json()) as {
      averageRating?: number;
      totalReviewCount?: number;
      reviews?: { reviewer?: { displayName?: string; profilePhotoUrl?: string }; starRating?: string; comment?: string; createTime?: string }[];
    };
    const data: AvisData = {
      note: Math.round((json.averageRating ?? 0) * 10) / 10,
      total: json.totalReviewCount ?? 0,
      lien: LIEN,
      laisserAvis: LAISSER,
      avis: (json.reviews ?? [])
        .filter((r) => r.comment)
        .map((r) => ({
          nom: r.reviewer?.displayName ?? "Client Google",
          photo: r.reviewer?.profilePhotoUrl,
          note: STARS[r.starRating ?? "FIVE"] ?? 5,
          texte: nettoyerAvis(r.comment!),
          date: r.createTime
            ? new Date(r.createTime).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
            : "",
        })),
    };
    cache = { at: Date.now(), data };
    return data;
  } catch (e) {
    console.error("Avis Google:", e);
    return cache?.data ?? null;
  }
});
