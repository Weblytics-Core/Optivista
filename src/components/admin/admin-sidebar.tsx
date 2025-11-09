
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Camera, Home, Image as ImageIcon, Settings, DownloadCloud } from "lucide-react";
import { Button } from "../ui/button";

const menuItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/admin/images",
    label: "Images",
    icon: ImageIcon,
  },
  {
    href: "/admin/downloads",
    label: "Downloads",
    icon: DownloadCloud,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarRail />
      <SidebarHeader className="p-4 items-center gap-2">
        <Camera className="w-8 h-8 text-sidebar-primary" />
        <span className="text-xl font-headline font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
          Admin
        </span>
        <div className="flex-1" />
        <SidebarTrigger className="hidden md:flex" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button asChild variant="ghost" className="justify-start gap-2 p-2">
          <Link href="/">
            <Home className="w-4 h-4"/>
            <span className="group-data-[collapsible=icon]:hidden">Back to Site</span>
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
