import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LightboxProjets, type ProjetLightbox } from "./lightbox-projets";

const projets: ProjetLightbox[] = [
  { img: "a.jpg", titre: "Aménagement de massifs", lieu: "Hérin", type: "Plantation & graminées" },
  { img: "b.jpg", titre: "Taille de haies", lieu: "Valenciennois", type: "Taille de précision" },
];

describe("LightboxProjets", () => {
  it("ouvre la photo du projet demandé", () => {
    render(<LightboxProjets projets={projets} index={1} onClose={() => {}} onIndexChange={() => {}} />);

    expect(screen.getByRole("dialog", { name: "Photo en grand : Taille de haies" })).toBeInTheDocument();
    expect(screen.getByText("Valenciennois · Taille de précision")).toBeInTheDocument();
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
  });

  it("passe au projet suivant avec la flèche droite", () => {
    const onIndexChange = vi.fn();
    render(<LightboxProjets projets={projets} index={0} onClose={() => {}} onIndexChange={onIndexChange} />);

    fireEvent.keyDown(window, { key: "ArrowRight" });

    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it("revient au premier projet depuis le dernier", () => {
    const onIndexChange = vi.fn();
    render(<LightboxProjets projets={projets} index={1} onClose={() => {}} onIndexChange={onIndexChange} />);

    fireEvent.keyDown(window, { key: "ArrowRight" });

    expect(onIndexChange).toHaveBeenCalledWith(0);
  });

  it("se ferme avec Échap", () => {
    const onClose = vi.fn();
    render(<LightboxProjets projets={projets} index={0} onClose={onClose} onIndexChange={() => {}} />);

    fireEvent.keyDown(window, { key: "Escape" });

    expect(onClose).toHaveBeenCalled();
  });

  it("rend la page à nouveau défilable une fois fermée", () => {
    document.body.style.overflow = "visible";
    const { unmount } = render(
      <LightboxProjets projets={projets} index={0} onClose={() => {}} onIndexChange={() => {}} />,
    );

    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("visible");
  });
});
