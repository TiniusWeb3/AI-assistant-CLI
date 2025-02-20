import { Link, useLocation } from "wouter";
import { Home, CheckSquare, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-sidebar border-r border-border p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-sidebar-foreground">TaskSync</h1>
      </div>
      <nav className="space-y-2">
        {navItems.map(({ icon: Icon, label, href }) => (
          <Link key={href} href={href}>
            <a
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                location === href && "bg-sidebar-accent"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </a>
          </Link>
        ))}
      </nav>
    </div>
  );
}
