import EcommerceMetrics from "./components/metrics";
import MonthlySalesChart from "./components/monthly-sales-chart";
import RecentOrders from "./components/recent-orders";

export default function EcommercePage() {
  return (
    <>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <EcommerceMetrics />
        </div>

        <div className="col-span-12">
          <RecentOrders />
        </div>

        <div className="col-span-12">
          <MonthlySalesChart />
        </div>
      </div>
    </>
  );
}