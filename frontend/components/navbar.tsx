"use client";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarItem,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Logout, AccountCircle } from "@mui/icons-material";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import DarkMode from "@mui/icons-material/DarkMode";
import LightMode from "@mui/icons-material/LightMode";
import clsx from "clsx";
import Image from "next/image";

// import { ROUTES } from "./sidebar/sidebarRoutes";

import { roboto } from "@/config/fonts";
import { RouteInterface } from "@/types/IRoute";

export const Navbar = ({ routes }: { routes: Array<RouteInterface> }) => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const onItemSelection = async (key: string | null) => {
    if (key === null) return;
    if (key === "switchTheme") setTheme(theme === "light" ? "dark" : "light");
    if (key === "logout") {
      // TODO: Implement Logout Flow
    }
  };

  return (
    <NextUINavbar
      isBlurred
      isMenuOpen={isMenuOpen}
      maxWidth="full"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="basis-1/6 sm:basis-full" justify="start">
        <NavbarMenuToggle className="flex md:hidden" />
        <NavbarBrand className="max-w-fit">
          <Link className="flex md:hidden justify-start items-center" href="/">
            <Image
              alt="APK Guardian"
              height={32}
              src="/logo.png"
              width={32}
            />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <Button
                className="text-sm font-normal text-default-600 bg-default-100"
                startContent={<AccountCircle />}
                variant="flat"
              >
                <span className="font-bold text-sm">
                  {"gurlivleen@example.com"}
                </span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              selectionMode="single"
              onSelectionChange={({ anchorKey }) =>
                onItemSelection(anchorKey ?? null)
              }
            >
              <DropdownItem
                key="switchTheme"
                startContent={
                  theme === "light" ? (
                    <DarkMode className="text-default-500" />
                  ) : (
                    <LightMode className="text-default-500" />
                  )
                }
              >
                Switch Theme
              </DropdownItem>
              <DropdownItem
                key="logout"
                startContent={
                  <Logout className="text-default-500" sx={{ fontSize: 22 }} />
                }
              >
                Sign Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {routes.map((ele) => {
          return (
            <Link
              key={ele.path}
              className="w-full"
              href={ele.path}
              onClick={() => setIsMenuOpen(false)}
            >
              <NavbarMenuItem
                className="flex gap-2 items-center"
                isActive={pathname === ele.path}
              >
                {ele.icon && <ele.icon />}
                <span className={clsx(roboto.className, "flex-1")}>
                  {ele.label}
                </span>
              </NavbarMenuItem>
            </Link>
          );
        })}
      </NavbarMenu>
    </NextUINavbar>
  );
};
