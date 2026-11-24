import { Outlet } from "react-router";
import ThemeToggler from "./theme-toggler";
import deliveryImg from "@/assets/delivery-banner.png";

export default function AuthLayout() {
  return (
    <div className="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900">
      <div className="relative flex min-h-screen w-full flex-col justify-center sm:p-0 lg:flex-row dark:bg-gray-900">
        {/* Left Side: Full-Bleed Delivery Image */}
        <div className="relative hidden h-screen w-full overflow-hidden bg-brand-950 lg:block lg:w-1/2">
          <img
            src={deliveryImg}
            alt="PillsBag Fast Medicine Delivery"
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Right Side: Sign In Form */}
        <Outlet />

        <div className="fixed inset-e-6 bottom-6 z-50 hidden sm:block">
          <ThemeToggler />
        </div>
      </div>
    </div>
  );
}