import logo from "@/assets/Pill-Bag-Logo.png";

interface PageLoaderProps {
  loading?: boolean;
}

export default function PageLoader({ loading = true }: PageLoaderProps) {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-white/80 backdrop-blur-md transition-opacity duration-300 dark:bg-gray-900/80">
      <div className="relative flex size-28 items-center justify-center rounded-full bg-white shadow-xl shadow-brand-500/10 dark:bg-gray-900">
        {/* Outer Light Green Track + Spinning Vivid Green Ring */}
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-brand-500/20 border-t-brand-500 border-r-brand-500" />

        {/* Center PillsBag Logo */}
        <img
          src={logo}
          alt="PillsBag Loading..."
          className="h-14 w-14 object-contain"
        />
      </div>
    </div>
  );
}