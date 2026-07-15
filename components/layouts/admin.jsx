import { AppSidebar } from "@/components/layouts/admin/app-sidebar";
import { TopNav } from "@/components/layouts/admin/top-nav";
import Breadcrumb from "@/components/layouts/admin/breadcrumb";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Admin({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 shadow items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <TopNav />
        </header>
        <Breadcrumb />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
