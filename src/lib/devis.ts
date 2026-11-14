import { z } from "zod";

export const devisSchema = z.object({
  id: z.string().uuid(),
  nom: z.string().trim().max(100).default("Client"),
  email: z.string().trim().max(255).default(""),
  telephone: z.string().trim().min(10, "Indiquez un numéro de téléphone valide").max(30),
  message: z.string().trim().max(1000).default(""),
  prestations: z.array(z.string()).max(10),
  prestationConfirmee: z.string().trim().max(200).default(""),
  website: z.string().max(200).default(""),
});

export type DevisPayload = z.infer<typeof devisSchema>;
