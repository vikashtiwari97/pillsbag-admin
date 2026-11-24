import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { cn } from "@/utils";
import logo from "@/assets/Pill-Bag-Logo.png";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div
      className={cn(
        "flex min-h-screen w-full flex-1 flex-col justify-center px-4 py-8 sm:px-6 lg:w-1/2 lg:px-8",
      )}
    >
      <div className="mx-auto w-full max-w-md">
        {/* Logo & Heading */}
        <div className="mb-8 text-center sm:text-left">
          <img
            src={logo}
            alt="PillsBag"
            className="mx-auto mb-5 h-14 w-auto object-contain sm:mx-0"
          />
          <h1 className="font-outfit text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white">
            Sign In
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter your email and password to access PillsBag Admin!
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pillsbag.com"
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/12 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-11 pl-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/12 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3.5 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-normal text-gray-700 select-none dark:text-gray-400">
              <input
                type="checkbox"
                className="size-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900"
              />
              Keep me logged in
            </label>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}