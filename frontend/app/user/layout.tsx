import SharedLayout from "@/components/layouts/shared-layout";
import { Navbar } from "@/components/navbar";
import Sidebar from "@/components/sidebar/sidebar";
import { USERS_ROUTES } from "@/components/sidebar/sidebarRoutes";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout
  return (
    <SharedLayout 
      sidebarComponent={<Sidebar routes={[...USERS_ROUTES]}/>}
      navbarComponent={<Navbar routes={[...USERS_ROUTES]} />}
    >
      {children}
    </SharedLayout>
  );
}