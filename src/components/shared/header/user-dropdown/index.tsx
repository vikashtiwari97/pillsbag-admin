import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { useAuth } from "@/contexts/AuthContext";
import { useChangeLocale, useLocale, useTranslations } from "@/i18n";
import { getLanguage, languages } from "@/i18n/languages";
import type { Locale } from "@/i18n/routing";
import { toast } from "react-toastify";
import {
  ChevronDownIcon,
  GlobeIcon,
  InfoCircleIcon,
  LogOutIcon,
  UserCircleIcon,
} from "@/icons";
import { cn } from "@/utils";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

export default function UserDropdown() {
  const t = useTranslations("userDropdown");
  const locale = useLocale() as Locale;
  const navigate = useNavigate();
  const changeLocale = useChangeLocale();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const currentLang = getLanguage(locale);
  const CurrentFlagIcon = currentLang.FlagIcon;

  const handleSelectLanguage = (id: Locale) => {
    changeLocale(id);
    navigate(pathname, { replace: true });
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/signin", { replace: true });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="dropdown-toggle flex items-center text-gray-700 dark:text-gray-400">
        <span className="me-3 flex h-11 w-11 items-center justify-center rounded-xl border border-brand-200 bg-brand-50 text-brand-600 dark:border-brand-500/30 dark:bg-brand-500/15 dark:text-brand-400">
          <svg
            className="size-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <circle cx="12" cy="10" r="3" />
            <path d="M7 18.5a6.5 6.5 0 0 1 10 0" />
          </svg>
        </span>

        <span className="me-1 block text-sm font-medium">
          {user?.roleId?.name || "Admin"}
        </span>

        <ChevronDownIcon
          className={cn(
            "size-5 text-gray-500 duration-200 dark:text-gray-400",
            isOpen ? "rotate-180" : "rotate-0",
          )}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={12} className="w-65 p-3">
        <div className="px-3 py-2">
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            {user?.roleId?.name || "Admin"}
          </span>
          <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
            {user?.email || "vikash@pillsbag.com"}
          </span>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link to="/store-account" />}>
          <UserCircleIcon className="size-6" />
          Store Account
        </DropdownMenuItem>

        <DropdownMenuItem render={<Link to="/profile" />}>
          <InfoCircleIcon className="size-6" />
          {t("support")}
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <GlobeIcon className="size-6" />
            <span>{t("language")}</span>
            <Badge
              variant="light"
              color="gray"
              size="sm"
              className="ms-auto me-1 h-auto gap-1.5 border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 text-shadow-none dark:border-gray-800 dark:bg-white/3 dark:text-gray-300 dark:text-shadow-none [&>svg]:size-3.5"
            >
              <span>{currentLang.shortName}</span>
              <CurrentFlagIcon className="size-3.5 shrink-0 overflow-hidden rounded-full" />
            </Badge>
          </DropdownMenuSubTrigger>

          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-56 p-2">
              {languages.map((language) => {
                const isSelected = locale === language.id;
                const FlagIcon = language.FlagIcon;

                return (
                  <DropdownMenuItem
                    key={language.id}
                    onClick={() => handleSelectLanguage(language.id)}
                    className={cn(
                      "flex items-center justify-between gap-2",
                      isSelected &&
                        "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "size-1.5 shrink-0 rounded-full transition-opacity",
                          isSelected
                            ? "bg-brand-500 opacity-100 dark:bg-brand-400"
                            : "opacity-0",
                        )}
                      />
                      <FlagIcon className="size-5 shrink-0 overflow-hidden rounded-full" />
                      <span className="truncate">{language.name}</span>
                    </span>

                    {language.badge && (
                      <Badge
                        variant="light"
                        color="warning"
                        className="rounded text-xs"
                      >
                        {language.badge}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={handleLogout}
          className="cursor-pointer"
        >
          <LogOutIcon />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}