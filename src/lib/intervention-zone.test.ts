import { describe, expect, it } from "vitest";
import { isInInterventionZone } from "./intervention-zone";

describe("French intervention area", () => {
  it("includes Hérin near Valenciennes", () => {
    expect(isInInterventionZone([3.4535917, 50.3570433])).toBe(true);
  });
  it("excludes Mons in Belgium even though it is within 50 km", () => {
    expect(isInInterventionZone([3.9523, 50.4542])).toBe(false);
  });
  it("excludes Tournai in Belgium", () => {
    expect(isInInterventionZone([3.3878, 50.6056])).toBe(false);
  });
  it("excludes French locations beyond 50 km", () => {
    expect(isInInterventionZone([2.295, 50.748])).toBe(false);
  });
});