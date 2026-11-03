import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import { distance } from "@turf/distance";
import type { Feature, Polygon, MultiPolygon } from "geojson";
import data from "@/data/intervention-zone.json";

export const interventionCentre = [3.518332, 50.357113];
export const interventionZone = data.zone as Feature<Polygon | MultiPolygon>;
export const interventionTowns = data.towns;

export function isInInterventionZone(coordinates: number[]) {
  return distance(interventionCentre, coordinates, { units: "kilometers" }) <= 50 &&
    booleanPointInPolygon(coordinates, interventionZone);
}