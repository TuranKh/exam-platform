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
import { SidebarPage, sidebarRoutes, UserRole } from "@/config/sidebar";
import UserService from "@/service/UserService";
import { useCallback } from "react";
import { useQuery } from "react-query";
import { Link, useLocation } from "react-router-dom";
import NavUser from "./NavUser";
import { DropdownMenuSeparator } from "./ui/dropdown-menu";

export default function AppSidebar() {
  const location = useLocation();

  const { data: userDetails } = useQuery({
    queryKey: ["get-user"],
    queryFn: UserService.getUser,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const { data: lastRegisteredUsersCount = 0 } = useQuery({
    queryKey: ["last-registered-users", userDetails?.id],
    queryFn: async () => {
      if (!userDetails?.id) return 0;
      return await UserService.getLastRegisteredUsers(userDetails.id);
    },
    enabled: !!userDetails?.id && userDetails.isAdmin,
    staleTime: Infinity,
  });

  const getAccess = useCallback(
    (role?: UserRole) => {
      if (!role) {
        return true;
      }

      if (!userDetails) {
        return false;
      }

      if (role === UserRole.All) {
        return true;
      }

      if (role === UserRole.Admin && userDetails.isAdmin) {
        return true;
      }

      if (role === UserRole.Student && !userDetails.isAdmin) {
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
                  hasAccess && (
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
                          <span className='flex items-center'>
                            {item.title}
                            {item.id === SidebarPage.Users &&
                              lastRegisteredUsersCount > 0 && (
                                <span className='inline-flex items-center justify-center w-6 h-6 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full'>
                                  {lastRegisteredUsersCount}
                                </span>
                              )}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                      <DropdownMenuSeparator />
                    </SidebarMenuItem>
                  )
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
