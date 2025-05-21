import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  // Auth Layout
  return (
    <div className="h-screen flex sm:flex-row items-center justify-between">
      <div className="flex flex-1 items-center justify-center h-screen">
        <img
          alt="kaam365 logo"
          className="img-fluid mt-3 size-96"
          src="/logo.png"
        />
      </div>
      <div className="flex-1 items-center justify-center bg-[#217373] h-screen">
        {children}
      </div>
    </div>
  );
}
