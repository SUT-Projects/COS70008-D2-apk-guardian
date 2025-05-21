import Sidebar from "../sidebar/sidebar";
import FullScreenLoader from "../loaders/full-screen-loader";
import { Suspense } from "react";
import { Navbar } from "../navbar";

export default function SharedLayout({
  children,
  sidebarComponent,
  navbarComponent
}: {
  children: React.ReactNode;
  sidebarComponent?: React.ReactNode;
  navbarComponent?: React.ReactNode;
}) {
  // Shared Layout
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <div className="flex h-screen overflow-hidden">
        <div className="flex-none w-64 border-e-1 hidden md:flex">
          { sidebarComponent }
        </div>
        <div className="flex flex-col flex-grow overflow-hidden">
          { navbarComponent }
          <main className="p-4 overflow-auto">{children}</main>
        </div>
      </div>
    </Suspense>
  );
}