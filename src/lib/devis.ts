import { z } from "zod";

export const devisSchema = z.object({
  id: z.string().uuid(),
  nom: z.string().trim().min(1, "Indiquez votre nom").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  telephone: z.string().trim().max(30),
  message: z.string().trim().min(1, "Écrivez un message").max(1000),
  prestations: z.array(z.enum(["Tonte", "Taille de haies", "Désherbage", "Entretien annuel"])).max(4),
  prestationConfirmee: z.string().trim().max(200),
  website: z.string().max(200).default(""),
});