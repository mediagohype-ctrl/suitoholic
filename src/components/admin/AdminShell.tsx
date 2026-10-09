"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ChevronDown,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Package,
  Settings,
  ShoppingBag,
  Tags,
  UserCircle,
  Users,
  X,
  ClipboardList,
} from "lucide-react";
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin/auth";
import { loginRedirectPath } from "@/lib/admin/api";
import { FeedbackProvider } from "./feedback";
import { Spinner, cn } from "./ui";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  adminOnly?: boolean;
}

const NAV: { section?: string; items: NavItem[] }[] = [
  { items: [{ href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> }] },
  {
    section: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders", icon: <ClipboardList className="h-4 w-4" /> },
      { href: "/admin/bags", label: "Bags", icon: <ShoppingBag className="h-4 w-4" /> },
    ],
  },
  {
    section: "Catalog",
    items: [
      { href: "/admin/products", label: "Products", icon: <Package className="h-4 w-4" /> },
      { href: "/admin/categories", label: "Categories", icon: <Tags className="h-4 w-4" /> },
    ],
  },
  {
    section: "Storefront",
    items: [
      { href: "/admin/content", label: "Page Content", icon: <FileText className="h-4 w-4" /> },
      { href: "/admin/media", label: "Media", icon: <ImageIcon className="h-4 w-4" /> },
    ],
  },
  {
    section: "Customers",
    items: [
      { href: "/admin/inquiries", label: "Inquiries", icon: <MessageSquare className="h-4 w-4" /> },
      { href: "/admin/subscribers", label: "Subscribers", icon: <Mail className="h-4 w-4" /> },
    ],
  },
  {
    section: "System",
    items: [
      { href: "/admin/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
      { href: "/admin/users", label: "Users", icon: <Users className="h-4 w-4" />, adminOnly: true },
    ],
  },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <FeedbackProvider>
        <ShellInner>{children}</ShellInner>
      </FeedbackProvider>
    </AdminAuthProvider>
  );
}

function ShellInner({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/admin";
  const isLogin = pathname.startsWith("/admin/login");
  const { status } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLogin && status === "anonymous") router.replace(loginRedirectPath());
  }, [isLogin, status, router]);

  if (isLogin) {
    return <div className="relative z-20 min-h-screen w-full bg-white text-[#14110E]">{children}</div>;
  }

  if (status !== "authenticated") {
    return (
      <div className="relative z-20 flex min-h-screen w-full items-center justify-center bg-white">
        <Spinner className="h-7 w-7" />
      </div>
    );
  }

  return <Frame pathname={pathname}>{children}</Frame>;
}

function Frame({ pathname, children }: { pathname: string; children: ReactNode }) {
  const [openFor, setOpenFor] = useState<string | null>(null);
  // The mobile drawer closes itself on navigation because it is tied to the path it was opened on.
  const drawerOpen = openFor === pathname;

  return (
    <div className="relative z-20 min-h-screen w-full bg-white text-[#14110E]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[#262626] bg-[#14110E] lg:flex print:hidden">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[150] lg:hidden print:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpenFor(null)} aria-hidden />
          <aside className="relative flex h-full w-72 max-w-[85vw] bg-[#14110E] shadow-2xl">
            <button type="button" onClick={() => setOpenFor(null)} aria-label="Close menu" className="absolute right-3 top-4 rounded p-1 text-white/70 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <SidebarContent pathname={pathname} />
          </aside>
        </div>
      )}

      <div className="flex min-h-screen min-w-0 flex-col lg:pl-64 print:pl-0">
        {/* Top bar (mobile) */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-[#E5E7EB] bg-white/95 px-4 backdrop-blur lg:hidden print:hidden">
          <button type="button" onClick={() => setOpenFor(pathname)} aria-label="Open menu" className="-ml-1 rounded-md p-1.5 text-[#14110E] hover:bg-[#F3F4F6]">
            <Menu className="h-5 w-5" />
          </button>
          <Wordmark dark />
          <UserMenu compact />
        </header>
        <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 print:max-w-none print:p-0">{children}</main>
      </div>
    </div>
  );
}

function Wordmark({ dark }: { dark?: boolean }) {
  return (
    <Link href="/admin" className="flex items-baseline gap-1.5">
      <span className={cn("font-serif-luxury text-xl font-bold tracking-[0.18em]", dark ? "text-[#14110E]" : "text-white")}>SUITOHOLIC</span>
      <span className="text-[10px] font-semibold tracking-[0.25em] text-[#9E774C]">ADMIN</span>
    </Link>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarContent({ pathname }: { pathname: string }) {
  const { isAdmin } = useAdminAuth();
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-16 shrink-0 items-center px-5">
        <Wordmark />
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-2">
        {NAV.map((group, gi) => {
          const items = group.items.filter((i) => !i.adminOnly || isAdmin);
          if (!items.length) return null;
          return (
            <div key={gi}>
              {group.section && <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">{group.section}</p>}
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                          active ? "bg-[#9E774C] text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
                        )}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
      <div className="space-y-2 border-t border-white/10 p-3">
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white">
          <ExternalLink className="h-4 w-4" />
          View store
        </a>
        <UserMenu />
      </div>
    </div>
  );
}

function UserMenu({ compact }: { compact?: boolean }) {
  const { user, logout } = useAdminAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const signOut = () => {
    logout();
    router.replace("/admin/login");
  };

  const initials = (user?.name || user?.email || "?")
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-md text-left",
          compact ? "p-1 hover:bg-[#F3F4F6]" : "px-2 py-2 text-white hover:bg-white/5",
        )}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#9E774C] text-xs font-bold text-white">{initials}</span>
        {!compact && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{user?.name || "Account"}</span>
              <span className="block truncate text-[11px] capitalize text-white/50">{user?.role ?? "—"}</span>
            </span>
            <ChevronDown className="h-4 w-4 text-white/50" />
          </>
        )}
      </button>
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute z-50 w-56 overflow-hidden rounded-lg border border-[#E5E7EB] bg-white py-1 text-sm text-[#14110E] shadow-xl",
            compact ? "right-0 top-full mt-2" : "bottom-full left-0 mb-2",
          )}
        >
          <div className="border-b border-[#EEF0F3] px-3 py-2">
            <p className="truncate font-medium">{user?.name}</p>
            <p className="truncate text-xs text-[#6B7280]">{user?.email}</p>
          </div>
          <Link href="/admin/account" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-[#F9FAFB]" role="menuitem">
            <UserCircle className="h-4 w-4 text-[#9E774C]" />
            My account
          </Link>
          <button type="button" onClick={signOut} className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-[#F9FAFB]" role="menuitem">
            <LogOut className="h-4 w-4 text-[#9E774C]" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
