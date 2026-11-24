import GridShape from "@/components/shared/grid-shape";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import { Link } from "react-router";
import type { Error404Props } from "./types";

export default function Error404({
  title = "ERROR",
  description = "We can’t seem to find the page you are looking for!",
  homeLinkText = "Back to Home Page",
  homeHref = "/",
  className,
}: Error404Props) {
  return (
    <div
      className={cn(
        "relative z-1 flex min-h-screen flex-col items-center justify-center overflow-hidden p-6",
        className,
      )}
    >
      <GridShape />
      <div className="mx-auto w-full max-w-60.5 text-center sm:max-w-118">
        <h1 className="mb-8 text-2xl font-bold text-gray-800 xl:text-[64px] dark:text-white/90">
          {title}
        </h1>

        <div className="my-4 flex items-center justify-center gap-2 sm:gap-4 select-none">
          <span className="font-outfit text-8xl font-extrabold tracking-tight text-brand-500 sm:text-[140px] leading-none">
            4
          </span>
          <div className="flex size-20 sm:size-32 items-center justify-center rounded-3xl border-4 border-brand-500 bg-brand-50 dark:bg-brand-500/10 shadow-lg">
            <svg
              className="size-12 sm:size-20 text-brand-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.5 20.5 19 12a4.95 4.95 0 1 0-7-7l-8.5 8.5a4.95 4.95 0 0 0 7 7Z" />
              <path d="m8.5 8.5 7 7" />
            </svg>
          </div>
          <span className="font-outfit text-8xl font-extrabold tracking-tight text-brand-500 sm:text-[140px] leading-none">
            4
          </span>
        </div>

        <p className="mt-10 mb-6 text-base text-gray-700 sm:text-lg dark:text-gray-400">
          {description}
        </p>

        <Button
          size="lg"
          variant="outline"
          className="h-12.5 bg-white"
          nativeButton={false}
          render={<Link to={homeHref} />}
        >
          {homeLinkText}
        </Button>
      </div>

      <p className="absolute inset-s-1/2 bottom-6 -translate-x-1/2 text-center text-sm text-gray-500 rtl:translate-x-1/2 dark:text-gray-400">
        &copy; {new Date().getFullYear()} - PillsBag
      </p>
    </div>
  );
}