import servicesPersonne from "@/assets/services-personne-transparent.png";
import creditImmediat from "@/assets/credit-immediat-transparent.png";

export function LogosServicesPersonne({ compact = false, logo }: { compact?: boolean; logo?: "services" | "credit" }) {
  return (
    <div className={logo ? "w-fit" : "flex w-fit items-start gap-8"}>
      {logo !== "credit" && (
      <img
        src={servicesPersonne}
        alt="Services à la personne"
        width={1600}
        height={900}
        loading="lazy"
        className={`shrink-0 object-contain ${compact ? "h-16 w-24" : "h-auto w-28 sm:w-32"}`}
      />
      )}
      {logo !== "services" && (
      <img
        src={creditImmediat}
        alt="50 % de crédit d’impôt immédiat"
        width={1000}
        height={1000}
        loading="lazy"
        className={`shrink-0 object-contain ${!logo ? "mt-5" : ""} ${compact ? "h-16 w-16" : "h-auto w-24 sm:w-28"}`}
      />
      )}
    </div>
  );
}