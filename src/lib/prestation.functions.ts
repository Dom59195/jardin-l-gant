import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const PRESTATIONS = [
  "Tonte de pelouse",
  "Taille de haies",
  "Débroussaillage",
  "Création / entretien de massifs",
  "Scarification",
  "Plantation",
  "Ramassage des feuilles mortes",
  "Évacuation des déchets verts",
  "Entretien régulier",
] as const;

export type Suggestion = { prestation: string; raison: string } | { erreur: string };

export const suggererPrestation = createServerFn({ method: "POST" })
  .inputValidator((d: { description: string }) =>
    z.object({ description: z.string().trim().min(10).max(1000) }).parse(d),
  )
  .handler(async ({ data }): Promise<Suggestion> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { erreur: "Service de suggestion indisponible." };
    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText, Output } = await import("ai");
    const openai = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: key,
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    try {
      const result = streamText({
        model: openai.responses("openai/gpt-6-astra"),
        maxRetries: 0,
        system:
          "Tu aides les visiteurs du site d'un jardinier paysagiste (Blondel Jardin) à choisir la prestation la plus adaptée. " +
          `Choisis exactement une prestation dans cette liste : ${PRESTATIONS.join(" ; ")}. ` +
          "Donne une raison courte (une phrase, en français, vouvoiement).",
        prompt: `Description du jardin par le visiteur : """${data.description}"""`,
        output: Output.object({
          schema: z.object({ prestation: z.enum(PRESTATIONS), raison: z.string() }),
        }),
        providerOptions: {
          openai: {
            forceReasoning: true,
            reasoningEffort: "low",
            reasoningSummary: "auto",
            store: false,
            include: ["reasoning.encrypted_content"],
          },
        },
      });
      const out = await result.output;
      return { prestation: out.prestation, raison: out.raison };
    } catch (e) {
      console.error("suggererPrestation", e);
      const status = (e as { statusCode?: number }).statusCode;
      if (status === 429) return { erreur: "Trop de demandes, réessayez dans un instant." };
      if (status === 402) return { erreur: "Service de suggestion momentanément indisponible." };
      return { erreur: "Impossible de proposer une prestation pour le moment." };
    }
  });
