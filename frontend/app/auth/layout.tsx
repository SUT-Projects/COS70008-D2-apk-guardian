import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  // Auth Layout
  return (
    <div className="h-screen flex sm:flex-row items-center justify-between">
      <div className="flex flex-1 items-center justify-center h-screen">
        <img
          alt="kaam365 logo"
          className="img-fluid mt-3 size-72"
          src="/assets/logo.svg"
        />
      </div>
      <div className="flex-1 items-center justify-center bg-[#1282A2] h-screen">
        {children}
      </div>
    </div>
  );
}
