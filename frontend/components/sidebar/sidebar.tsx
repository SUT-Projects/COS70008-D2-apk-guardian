"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

import { WrapImageWithLoader } from "../loaders/image-with-loader";

import { fontMono, roboto } from "@/config/fonts";
import Image from "next/image";
import { RouteInterface } from "@/types/IRoute";

export default function Sidebar({ 
  routes
}: { 
  routes: Array<RouteInterface>
}) {
  const pathName = usePathname();

  // Helper function to correctly detect active route
  const isRouteActive = (routePath: string) => {
    // Exact match
    if (pathName === routePath) return true;
    const paths = routePath.replace("/", "").split("/");

    // Check if it is a valid subpath by ensuring the next character is '/' or nothing
    if (routes.some((x) => x.path === pathName)) {
      return pathName.startsWith(paths[paths.length - 1]);
    }

    return false;
  };

  return (
    <Navbar
      className="h-full min-w-full items-start overflow-y-auto"
      height={0}
      position="static"
      style={{
        zIndex: 0,
      }}
    >
      <NavbarContent
        className="h-full flex flex-col justify-start"
        style={{ zIndex: 0 }}
      >
        <NavbarBrand>
          <Image
            alt="APK Guardian"
            height={400}
            src="/logo.png"
            width={200}
          />
        </NavbarBrand>
        <ul className="flex flex-col w-full gap-2 pb-3">
          {routes.map((route, idx) => {
            const isActive = isRouteActive(route.path);

            return (
              <Link
                key={route.path + idx}
                className={clsx(
                  "px-4 py-2 mb-1 rounded-lg w-full",
                  {
                    "bg-primary-700 text-white font-bold": isActive,
                    "hover:bg-primary-200 text-gray-500": !isActive,
                  },
                  fontMono.variable,
                )}
                href={route.path}
              >
                <NavbarItem className="flex gap-2 items-center">
                  {route.icon && <route.icon />}
                  <span className={clsx(roboto.className, "flex-1")}>
                    {route.label}
                  </span>
                </NavbarItem>
              </Link>
            );
          })}
        </ul>
      </NavbarContent>
    </Navbar>
  );
}
