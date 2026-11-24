import { useTranslations } from "@/i18n";
import { BoxIcon, UsersIcon  } from "@/icons";
import { RiderIcon } from "@/icons/RiderIcon";
import { ChemistIcon } from "@/icons/ChemistIcon";
import MetricCard from "./metric-card";

export default function EcommerceMetrics() {
  const t = useTranslations("ecommerce.metrics");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
      <MetricCard
        icon={<UsersIcon />}
        title={t("customers")}
        value="3,782"
        change="11.01%"
        direction="up"
      />
      <MetricCard
        icon={<BoxIcon />}
        title={t("orders")}
        value="5,359"
        change="9.05%"
        direction="down"
      />
      <MetricCard
        icon={<RiderIcon />}
        title="Total Rider"
        value="148"
        change="6.24%"
        direction="up"
      />
      <MetricCard
        icon={<ChemistIcon />}
        title="Total Chemist"
        value="86"
        change="4.15%"
        direction="up"
      />
    </div>
  );
}