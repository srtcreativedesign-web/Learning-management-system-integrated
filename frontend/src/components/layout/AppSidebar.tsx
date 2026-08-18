import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  CheckSquare,
  BarChart3,
  FileText,
  Building2,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
} from '@/components/animate-ui/components/radix/sidebar';
import { cn } from '@/lib/utils';

export const AppSidebar: React.FC = () => {
  const location = useLocation();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    audit: true,
    analytics: true,
    sop: true,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isPathActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200 bg-white">
      {/* Header */}
      <SidebarHeader className="p-3 border-b border-slate-100 flex items-center justify-between group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 bg-[#419CC3]/10 text-[#419CC3] rounded-lg flex items-center justify-center font-bold shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <h1 className="font-bold text-xs text-slate-800 tracking-tight truncate leading-tight">
              TND LMS
            </h1>
            <p className="text-[10px] text-slate-400 font-medium truncate">
              Learning & Audit
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="custom-scrollbar px-2 py-3 space-y-2 group-data-[collapsible=icon]:px-1.5 group-data-[collapsible=icon]:py-2">
        {/* Main Navigation */}
        <SidebarGroup className="group-data-[collapsible=icon]:p-0">
          <SidebarGroupLabel className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-2 group-data-[collapsible=icon]:hidden">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {/* Beranda Dasbor */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isPathActive('/dashboard')}
                  tooltip="Dasbor"
                  className={cn(
                    'font-medium text-xs px-2.5 py-2 rounded-lg transition-colors duration-150',
                    isPathActive('/dashboard')
                      ? 'bg-[#419CC3]/10 text-[#419CC3] font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <NavLink to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
                    <LayoutDashboard className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="truncate group-data-[collapsible=icon]:hidden">Dasbor</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Pustaka Materi */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isPathActive('/library')}
                  tooltip="Pustaka Materi"
                  className={cn(
                    'font-medium text-xs px-2.5 py-2 rounded-lg transition-colors duration-150',
                    isPathActive('/library')
                      ? 'bg-[#419CC3]/10 text-[#419CC3] font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <NavLink to="/library" className="flex items-center gap-2.5 overflow-hidden">
                    <FolderOpen className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="truncate group-data-[collapsible=icon]:hidden">Pustaka Materi</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Manajemen Karyawan */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isPathActive('/employees')}
                  tooltip="Manajemen Karyawan"
                  className={cn(
                    'font-medium text-xs px-2.5 py-2 rounded-lg transition-colors duration-150',
                    isPathActive('/employees')
                      ? 'bg-[#419CC3]/10 text-[#419CC3] font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <NavLink to="/employees" className="flex items-center gap-2.5 overflow-hidden">
                    <Users className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="truncate group-data-[collapsible=icon]:hidden">Manajemen Karyawan</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Audit Group */}
        <SidebarGroup className="group-data-[collapsible=icon]:p-0">
          <SidebarGroupLabel className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-2 group-data-[collapsible=icon]:hidden">
            Sistem Audit
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => toggleSection('audit')}
                  tooltip="Sistem Audit"
                  className="font-medium text-xs px-2.5 py-2 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center justify-between transition-colors duration-150 overflow-hidden"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <CheckSquare className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="truncate group-data-[collapsible=icon]:hidden">Audit Lapangan</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-data-[collapsible=icon]:hidden shrink-0',
                      expandedSections.audit ? 'rotate-0' : '-rotate-90'
                    )}
                  />
                </SidebarMenuButton>

                {expandedSections.audit && (
                  <SidebarMenuSub className="ml-4 border-l border-slate-200 pl-2 space-y-1 pt-1 group-data-[collapsible=icon]:hidden">
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isPathActive('/outlets')}>
                        <NavLink to="/outlets">Manajemen Outlet</NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isPathActive('/checklist-builder')}>
                        <NavLink to="/checklist-builder">Kriteria Checklist</NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isPathActive('/audit-reports')}>
                        <NavLink to="/audit-reports">Laporan Inspeksi</NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Analytics Group */}
        <SidebarGroup className="group-data-[collapsible=icon]:p-0">
          <SidebarGroupLabel className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-2 group-data-[collapsible=icon]:hidden">
            Analytics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => toggleSection('analytics')}
                  tooltip="Analytics & Laporan"
                  className="font-medium text-xs px-2.5 py-2 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center justify-between transition-colors duration-150 overflow-hidden"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <BarChart3 className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="truncate group-data-[collapsible=icon]:hidden">Laporan & Evaluasi</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-data-[collapsible=icon]:hidden shrink-0',
                      expandedSections.analytics ? 'rotate-0' : '-rotate-90'
                    )}
                  />
                </SidebarMenuButton>

                {expandedSections.analytics && (
                  <SidebarMenuSub className="ml-4 border-l border-slate-200 pl-2 space-y-1 pt-1 group-data-[collapsible=icon]:hidden">
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isPathActive('/analytics/leaderboard')}>
                        <NavLink to="/analytics/leaderboard">Papan Peringkat (XP)</NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isPathActive('/analytics/quiz-history')}>
                        <NavLink to="/analytics/quiz-history">Riwayat Kuis</NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isPathActive('/analytics/audit')}>
                        <NavLink to="/analytics/audit">Laporan Audit Outlet</NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* SOP Group */}
        <SidebarGroup className="group-data-[collapsible=icon]:p-0">
          <SidebarGroupLabel className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-2 group-data-[collapsible=icon]:hidden">
            SOP & Prosedur
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => toggleSection('sop')}
                  tooltip="Standar Operasional"
                  className="font-medium text-xs px-2.5 py-2 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center justify-between transition-colors duration-150 overflow-hidden"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="truncate group-data-[collapsible=icon]:hidden">Pustaka SOP</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-data-[collapsible=icon]:hidden shrink-0',
                      expandedSections.sop ? 'rotate-0' : '-rotate-90'
                    )}
                  />
                </SidebarMenuButton>

                {expandedSections.sop && (
                  <SidebarMenuSub className="ml-4 border-l border-slate-200 pl-2 space-y-1 pt-1 group-data-[collapsible=icon]:hidden">
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isPathActive('/sop/viewer')}>
                        <NavLink to="/sop/viewer">Daftar SOP</NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isPathActive('/sop/management')}>
                        <NavLink to="/sop/management">Unggah Dokumen</NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-2.5 border-t border-slate-100 bg-slate-50/40 flex flex-row items-center justify-between group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-2.5 min-w-0 group-data-[collapsible=icon]:hidden">
          <div className="w-7 h-7 rounded-lg bg-[#419CC3] text-white flex items-center justify-center font-bold text-xs shrink-0">
            BS
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">Budi Santoso</p>
            <p className="text-[10px] text-slate-400 truncate">Instruktur</p>
          </div>
        </div>

        <NavLink
          to="/login"
          title="Keluar"
          className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
        >
          <LogOut className="w-4 h-4" />
        </NavLink>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};
