import AppLayout from "@/components/layout/app-layout";
import { useAuth } from "@/contexts/AuthContext";
import ChemistsPage from "@/pages/main/chemists/index";
import EcommercePage from "@/pages/main/dashboard/ecommerce";
import FormElementsPage from "@/pages/main/forms/form-elements";
import { BlankPage, Error404Page } from "@/pages/main/pages";
import StoreAccountsPage from "@/pages/main/store-accounts/index";
import BasicTablesPage from "@/pages/main/tables/basic-tables";
import { AuthLayout, SignInPage } from "@/pages/others/auth";
import BarChartPage from "@/pages/others/charts/bar-chart";
import LineChartPage from "@/pages/others/charts/line-chart";
import Alerts from "@/pages/others/ui-elements/alerts";
import Avatars from "@/pages/others/ui-elements/avatars";
import Badges from "@/pages/others/ui-elements/badges";
import Buttons from "@/pages/others/ui-elements/buttons";
import Images from "@/pages/others/ui-elements/images";
import Videos from "@/pages/others/ui-elements/videos";
import "flatpickr/dist/flatpickr.css";
import { Navigate, Outlet, Route, Routes } from "react-router";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const hasToken = isAuthenticated || Boolean(localStorage.getItem("accessToken"));
  return hasToken ? <Outlet /> : <Navigate to="/signin" replace />;
}

function PublicRoute() {
  const { isAuthenticated } = useAuth();
  const hasToken = isAuthenticated || Boolean(localStorage.getItem("accessToken"));
  return hasToken ? <Navigate to="/" replace /> : <Outlet />;
}

export default function App() {
  return (
    <Routes>
      {/* Protected Dashboard Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<EcommercePage />} />

          {/* Others Page */}
          <Route path="/store-account" element={<StoreAccountsPage />} />
          <Route path="/chemists" element={<ChemistsPage />} />
          <Route path="/blank" element={<BlankPage />} />

          {/* Forms */}
          <Route path="/form-elements" element={<FormElementsPage />} />

          {/* Tables */}
          <Route path="/basic-tables" element={<BasicTablesPage />} />

          {/* Ui Elements */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />

          {/* Charts */}
          <Route path="/line-chart" element={<LineChartPage />} />
          <Route path="/bar-chart" element={<BarChartPage />} />
        </Route>
      </Route>

      {/* Auth Layout */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignInPage />} />
        </Route>
      </Route>

      {/* Full-width / Error / Status Pages */}
      <Route path="/error-404" element={<Error404Page />} />

      {/* Fallback Route */}
      <Route path="*" element={<Error404Page />} />
    </Routes>
  );
}