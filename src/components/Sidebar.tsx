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
import { sidebarRoutes, UserRole } from "@/config/sidebar";
import UserService from "@/service/UserService";
import { useQuery } from "react-query";
import { Link, useLocation } from "react-router-dom";
import NavUser from "./NavUser";
import { DropdownMenuSeparator } from "./ui/dropdown-menu";
import { useCallback } from "react";

export default function AppSidebar() {
  const location = useLocation();

  const { data: userDetails } = useQuery({
    queryKey: ["get-user"],
    queryFn: UserService.getUser,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const getAccess = useCallback(
    (role?: UserRole) => {
      if (!role) {
        return true;
      }

      if (!userDetails) {
        return false;
      }

      if (role === UserRole.Admin && userDetails?.isAdmin) {
        return true;
      }

      if (role === UserRole.Student && !userDetails?.isAdmin) {
        return true;
      }

      return false;
    },
    [userDetails],
  );

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarRoutes.map((item) => {
                const hasAccess = getAccess(item.allowedRole);
                return (
                  <>
                    {hasAccess && (
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
                    )}
                  </>
                );
              })}
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
