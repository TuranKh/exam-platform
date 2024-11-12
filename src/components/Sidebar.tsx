import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { sidebarRoutes } from "@/config/sidebar";
import { Link, useLocation } from "react-router-dom";
import NavUser from "./NavUser";
import { DropdownMenuSeparator } from "./ui/dropdown-menu";

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
                      className='transition-all'
                      to={item.url}
                      style={
                        item.url === location.pathname
                          ? {
                              color: "white",
                              backgroundColor: "hsl(var(--primary))",
                            }
                          : {}
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenuSeparator />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
