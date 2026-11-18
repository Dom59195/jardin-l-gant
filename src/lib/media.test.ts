import { describe, expect, it } from "vitest";
import { estVideo } from "./media";
describe("estVideo", () => {
  it("reconnaît une vidéo mp4 ou mov", () => {
    expect(estVideo("https://x/a/123.mp4")).toBe(true);
    expect(estVideo("https://x/a/123.MOV?t=1")).toBe(true);
  });
  it("ne prend pas une photo pour une vidéo", () => {
    expect(estVideo("https://x/a/123.jpg")).toBe(false);
  });
});
