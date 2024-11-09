import { Book, Home } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

const sidebarRoutes = [
  {
    title: "Ana səhifə",
    url: "/home",
    icon: Home,
  },
  {
    title: "Yeni imtahan",
    url: "/create-exam",
    icon: Book,
  },
  {
    title: "Statistika",
    url: "/statistics",
    icon: Book,
  },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarRoutes.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      style={{
                        backgroundColor: `${
                          item.url === location.pathname &&
                          "hsl(var(--sidebar-accent))"
                        }`,
                      }}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
