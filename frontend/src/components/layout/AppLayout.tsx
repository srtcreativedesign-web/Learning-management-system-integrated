import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/animate-ui/components/radix/sidebar';
import { AppSidebar } from './AppSidebar';
import { Separator } from '@/components/ui/separator';

export const AppLayout: React.FC = () => {
  return (
    <SidebarProvider defaultOpen>
      {/* Animated Radix Sidebar */}
      <AppSidebar />

      {/* Main Inset Content */}
      <SidebarInset className="bg-slate-50/60 min-h-screen flex flex-col">
        {/* Top Navbar with Sidebar Collapse Trigger */}
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md transition-[width,height] ease-linear">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 text-slate-600 hover:text-slate-900" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-slate-200" />
            <span className="text-xs font-bold text-slate-500 tracking-wide uppercase">
              TND SYSTEM &bull; Learning & Audit Portal
            </span>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
