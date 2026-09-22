import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Home, Package, Banknote, Users, MessageSquare, LogOut, Menu } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthenticatedLayout,
});

const NAV = [
  { to: "/dashboard", label: "نظرة عامة", icon: Home },
  { to: "/goods", label: "بضاعة", icon: Package },
  { to: "/money", label: "أموال", icon: Banknote },
  { to: "/beneficiaries", label: "المستفيدين", icon: Users },
  { to: "/chat", label: "Chat AI", icon: MessageSquare },
] as const;

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const navLinks = (onNavigate?: () => void) => (
    <nav className="flex-1 space-y-1 p-3">
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: true }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" }}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* القائمة الجانبية — شاشات كبيرة فقط */}
      <aside className="hidden w-56 shrink-0 flex-col border-l bg-card md:flex">
        <div className="border-b px-5 py-5">
          <h1 className="text-xl font-bold text-foreground">dafter</h1>
          <p className="text-xs text-muted-foreground">حسابات ومخازن ببساطة</p>
        </div>
        {navLinks()}
        <div className="border-t p-3">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* المحتوى */}
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        {/* شريط علوي للموبايل */}
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b bg-card px-4 py-3 md:hidden">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="القائمة"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border text-foreground"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-64 flex-col p-0">
              <div className="border-b px-5 py-5">
                <h1 className="text-xl font-bold text-foreground">dafter</h1>
                <p className="text-xs text-muted-foreground">حسابات ومخازن ببساطة</p>
              </div>
              {navLinks(() => setMenuOpen(false))}
              <div className="border-t p-3">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  تسجيل الخروج
                </button>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="min-w-0 truncate text-lg font-bold text-foreground">dafter</h1>
        </header>

        <div className="mx-auto w-full max-w-3xl flex-1 p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
