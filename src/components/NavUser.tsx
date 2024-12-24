import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import { useQuery } from "react-query";
import UserService from "@/service/UserService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

export default function NavUser() {
  const { isMobile } = useSidebar();
  const { data: userDetails } = useQuery({
    queryKey: ["get-user"],
    queryFn: UserService.getUser,
  });
  const navigate = useNavigate();

  const signOut = async function () {
    const error = await UserService.signOut();

    if (error) {
      toast.error("Çıxış edərkən xəta baş verdi");
      return;
    }
    navigate("/auth");
  };

  const fullname = useMemo(() => {
    if (!userDetails) {
      return;
    }
    return `${userDetails.name} ${userDetails.surname}`;
  }, [userDetails]);

  const initials = useMemo(() => {
    if (!userDetails) {
      return;
    }
    return `${userDetails.name[0].toUpperCase()}${userDetails.surname[0].toUpperCase()}`;
  }, [userDetails]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage src={"no-image"} alt={"Temporary"} />
                <AvatarFallback className='rounded-lg'>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{fullname}</span>
                <span className='truncate text-xs'>{userDetails.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? "bottom" : "right"}
            align='start'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={"no-avatar"} alt={fullname} />
                  <AvatarFallback className='rounded-lg'>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>{fullname}</span>
                  <span className='truncate text-xs'>{userDetails.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Hesabım
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Ödəniş
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Bildirişlər
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut />
              Çıxış et
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
