
import { createServerFn } from "@tanstack/react-start";
import { devisSchema } from "./devis";

export const envoyerDevis = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => devisSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website) throw new Error("Demande refusée.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("submit_quote").insert({
      _id: data.id,
      _nom: data.nom,
      _email: data.email,
      _telephone: data.telephone,
      _message: data.message,
      _prestations: data.prestations,
      _prestation_confirmee: data.prestationConfirmee,
    });

    if (error) {
      throw new Error("Impossible d'enregistrer votre demande. Réessayez dans quelques minutes ou appelez-nous.");
    }

    try {
      const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
      await sendTemplateEmail("nouveau-devis", "blondeljardin@gmail.com", {
        templateData: {
          nom: data.nom,
          email: data.email,
          telephone: data.telephone,
          prestations: data.prestations,
          message: data.message,
        },
        idempotencyKey: `nouveau-devis-${data.id}`,
      });
    } catch (e) {
      console.error("Envoi de l'e-mail de devis impossible :", e);
    }

    return { saved: true };
  });
