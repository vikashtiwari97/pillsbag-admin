import { SidebarHeader } from "@/components/ui/sidebar";
import { cn } from "@/utils";
import { Link } from "react-router";
import logo from "@/assets/Pill-Bag-Logo.png";

interface AppSidebarHeaderProps {
  showContent: boolean;
}

export default function AppSidebarHeader({
  showContent,
}: AppSidebarHeaderProps) {
  return (
    <SidebarHeader
      className={cn(
        "pt-5 pb-8",
        showContent ? "px-5" : "px-2",
      )}
    >
      <Link to="/" className="flex w-full items-center justify-center">
        {showContent ? (
          <img
            src={logo}
            alt="PillsBag"
            className="h-16 w-auto object-contain"
          />
        ) : (
          <img
            src={logo}
            alt="PillsBag"
            className="size-10 shrink-0 object-contain"
          />
        )}
      </Link>
    </SidebarHeader>
  );
}