import SharedLayout from "@/components/layouts/shared-layout";
import { Navbar } from "@/components/navbar";
import Sidebar from "@/components/sidebar/sidebar";
import { ADMIN_ROUTES } from "@/components/sidebar/sidebarRoutes";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout
  return (
    <SharedLayout
      sidebarComponent={<Sidebar routes={[...ADMIN_ROUTES]} />}
      navbarComponent={<Navbar routes={[...ADMIN_ROUTES]} />}
    >
      {children}
    </SharedLayout>
  );
}