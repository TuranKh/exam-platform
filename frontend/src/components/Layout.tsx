import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-full relative'>
        <SidebarTrigger />
        <div className='p-4'>{children}</div>
      </main>
    </SidebarProvider>
  );
}
