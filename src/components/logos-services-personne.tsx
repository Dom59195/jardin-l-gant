import servicesPersonne from "@/assets/logo-services-personne.png.asset.json";
import creditImmediat from "@/assets/logo-credit-immediat.png.asset.json";

export function LogosServicesPersonne({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex w-fit items-center gap-3 ${compact ? "" : "sm:gap-5"}`}>
      <img
        src={servicesPersonne.url}
        alt="Services à la personne"
        width={1600}
        height={900}
        loading="lazy"
        className={`shrink-0 rounded-lg object-contain ${compact ? "h-[54px] w-24" : "h-[81px] w-36 sm:h-[90px] sm:w-40"}`}
      />
      <img
        src={creditImmediat.url}
        alt="50 % de crédit d’impôt immédiat"
        width={1000}
        height={1000}
        loading="lazy"
        className={`shrink-0 rounded-lg object-contain ${compact ? "h-16 w-16" : "h-24 w-24 sm:h-28 sm:w-28"}`}
      />
    </div>
  );
}