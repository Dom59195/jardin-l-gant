import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { projets as projetsParDefaut, type Projet } from "@/lib/projets";

// Dans la fonction Projets() :
function Projets() {
  const [listeProjets, setListeProjets] = useState<Projet[]>(projetsParDefaut);
  const [ouvert, setOuvert] = useState<number | null>(null);
  const declencheur = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    supabase
      .from("projets")
      .select("*")
      .order("ordre", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setListeProjets(data as unknown as Projet[]);
        }
      });
  }, []);

  // Ensuite, utilisez `listeProjets.map(...)` et `listeProjets[ouvert]` au lieu de `projets`
