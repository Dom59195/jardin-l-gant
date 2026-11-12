import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ComponentProps } from "react";

import { LightboxProjets, type ProjetLightbox } from "./lightbox-projets";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, ...props }: ComponentProps<"a"> & { to: string }) => <a href={to} {...props} />,
}));

const projetTest: ProjetLightbox = {
  img: "p1.jpg",
  photos: ["p1.jpg", "p2.jpg", "p3.jpg"],
  titre: "Taille de haies",
  lieu: "Valenciennois",
  type: "Taille de précision",
  description: "Entretien soigné.",
};

describe("LightboxProjets", () => {
  it("ouvre la photo du projet et affiche ses informations", () => {
    render(<LightboxProjets projet={projetTest} onClose={() => {}} />);
    expect(screen.getByRole("dialog", { name: "Photo en grand : Taille de haies" })).toBeInTheDocument();
    expect(screen.getByText("Valenciennois · Taille de précision")).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("change de photo avec les flèches du clavier", () => {
    render(<LightboxProjets projet={projetTest} onClose={() => {}} />);
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("se ferme avec la touche Échap", () => {
    const onClose = vi.fn();
    render(<LightboxProjets projet={projetTest} onClose={onClose} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("bloque le défilement de la page tant que la fenêtre est ouverte", () => {
    document.body.style.overflow = "visible";
    const { unmount } = render(<LightboxProjets projet={projetTest} onClose={() => {}} />);
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("visible");
  });
});
