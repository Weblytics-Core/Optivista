import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="min-h-screen flex-1 p-4 sm:p-6 md:p-8 bg-muted/40">
          {children}
        </SidebarInset>
    </SidebarProvider>
  );
}
