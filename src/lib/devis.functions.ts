import { createServerFn } from "@tanstack/react-start";
import { devisSchema } from "./devis";

export const envoyerDevis = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => devisSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website) throw new Error("Demande refusée.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.rpc("submit_quote", {
      _id: data.id, _nom: data.nom, _email: data.email,
      _telephone: data.telephone, _message: data.message,
      _prestations: data.prestations, _prestation_confirmee: data.prestationConfirmee,
    });
    if (error) throw new Error("Impossible d’enregistrer votre demande. Réessayez dans quelques minutes ou appelez-nous.");
    return { saved: true };
  });