
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  BarChartHorizontal, 
  Settings, 
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: '/',
  },
  {
    label: 'Transactions',
    icon: <Receipt className="h-5 w-5" />,
    href: '/transactions',
  },
  {
    label: 'Budget',
    icon: <PieChart className="h-5 w-5" />,
    href: '/budget',
  },
  {
    label: 'Reports',
    icon: <BarChartHorizontal className="h-5 w-5" />,
    href: '/reports',
  },
  {
    label: 'Settings',
    icon: <Settings className="h-5 w-5" />,
    href: '/settings',
  },
];

export function Navbar() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);

  const NavContent = () => (
    <div className="flex flex-col space-y-1 w-full">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
            "text-finance-primary dark:text-white hover:bg-finance-secondary/10 hover:text-finance-secondary transition-colors"
          )}
          onClick={() => setIsOpen(false)}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-finance-primary dark:text-white">
            Finance<span className="text-finance-secondary">Zenith</span>
          </Link>
        </div>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 pt-10">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
            <div className="p-4">
              <NavContent />
            </div>
          </SheetContent>
        </Sheet>
      </header>
    );
  }

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 border-r overflow-y-auto flex flex-col z-40">
      <div className="p-4 border-b">
        <Link to="/" className="text-xl font-bold text-finance-primary dark:text-white">
          Finance<span className="text-finance-secondary">Zenith</span>
        </Link>
      </div>
      <div className="flex-1 p-4">
        <NavContent />
      </div>
      <div className="p-4 border-t">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} FinanceZenith
        </div>
      </div>
    </aside>
  );
}
