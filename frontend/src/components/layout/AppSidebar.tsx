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
  GraduationCap,
  ShieldCheck,
  UserCheck,
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
import { useAuth } from '@/context/AuthContext';
import { canAccessTraining, canAccessAudit, canAccessAll, ROLE_BADGES, UserRole } from '@/types/auth';

export const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { user, role, switchRole, logout } = useAuth();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    inhouse: true,
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

  const hasTrainingAccess = canAccessTraining(role);
  const hasAuditAccess = canAccessAudit(role);
  const hasFullAccess = canAccessAll(role);
  const badge = ROLE_BADGES[role] || ROLE_BADGES.AUDITOR;

  const initials = user.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'US';

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
              {hasFullAccess ? 'Portal Global HRBP' : role === 'TRAINER' ? 'Portal Trainer' : 'Portal Auditor'}
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
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <NavLink to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
                    <LayoutDashboard
                      className={cn(
                        'w-4 h-4 shrink-0',
                        isPathActive('/dashboard') ? 'text-[#419CC3]' : 'text-slate-600'
                      )}
                    />
                    <span className="truncate group-data-[collapsible=icon]:hidden">Dasbor</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Pustaka Materi (Trainer & Super Admin / HRBP only) */}
              {hasTrainingAccess && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isPathActive('/library')}
                    tooltip="Pustaka Materi"
                    className={cn(
                      'font-medium text-xs px-2.5 py-2 rounded-lg transition-colors duration-150',
                      isPathActive('/library')
                        ? 'bg-[#419CC3]/10 text-[#419CC3] font-bold'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    )}
                  >
                    <NavLink to="/library" className="flex items-center gap-2.5 overflow-hidden">
                      <FolderOpen
                        className={cn(
                          'w-4 h-4 shrink-0',
                          isPathActive('/library') ? 'text-[#419CC3]' : 'text-slate-600'
                        )}
                      />
                      <span className="truncate group-data-[collapsible=icon]:hidden">Pustaka Materi</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Manajemen Karyawan (Super Admin, HRBP, Trainer) */}
              {(hasFullAccess || role === 'TRAINER') && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isPathActive('/employees')}
                    tooltip="Manajemen Karyawan"
                    className={cn(
                      'font-medium text-xs px-2.5 py-2 rounded-lg transition-colors duration-150',
                      isPathActive('/employees')
                        ? 'bg-[#419CC3]/10 text-[#419CC3] font-bold'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    )}
                  >
                    <NavLink to="/employees" className="flex items-center gap-2.5 overflow-hidden">
                      <Users
                        className={cn(
                          'w-4 h-4 shrink-0',
                          isPathActive('/employees') ? 'text-[#419CC3]' : 'text-slate-600'
                        )}
                      />
                      <span className="truncate group-data-[collapsible=icon]:hidden">Manajemen Karyawan</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* In-House Training Group (Trainer, Super Admin, HRBP) */}
        {hasTrainingAccess && (
          <SidebarGroup className="group-data-[collapsible=icon]:p-0">
            <SidebarGroupLabel className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-2 group-data-[collapsible=icon]:hidden">
              In-House Training
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => toggleSection('inhouse')}
                    tooltip="In-House Training"
                    className="font-medium text-xs px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center justify-between transition-colors duration-150 overflow-hidden"
                  >
                    <GraduationCap className="w-4 h-4 text-slate-600 shrink-0" />
                    <span className="truncate group-data-[collapsible=icon]:hidden flex-1 text-left">
                      Training Outlet
                    </span>
                    <ChevronDown
                      className={cn(
                        'w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-data-[collapsible=icon]:hidden shrink-0',
                        expandedSections.inhouse ? 'rotate-0' : '-rotate-90'
                      )}
                    />
                  </SidebarMenuButton>

                  {expandedSections.inhouse && (
                    <SidebarMenuSub className="ml-4 border-l border-slate-200 pl-2 space-y-1 pt-1 group-data-[collapsible=icon]:hidden">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isPathActive('/in-house/checklists')}>
                          <NavLink to="/in-house/checklists">Checklist Training (SB/B/C/K)</NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isPathActive('/in-house/sessions')}>
                          <NavLink to="/in-house/sessions">Sesi & Evaluasi Nilai</NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Audit Group (Auditor, Super Admin, HRBP) */}
        {hasAuditAccess && (
          <SidebarGroup className="group-data-[collapsible=icon]:p-0">
            <SidebarGroupLabel className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-2 group-data-[collapsible=icon]:hidden">
              Sistem Audit Lapangan
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => toggleSection('audit')}
                    tooltip="Sistem Audit"
                    className="font-medium text-xs px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center justify-between transition-colors duration-150 overflow-hidden"
                  >
                    <CheckSquare className="w-4 h-4 text-slate-600 shrink-0" />
                    <span className="truncate group-data-[collapsible=icon]:hidden flex-1 text-left">
                      Audit Outlet
                    </span>
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
                          <NavLink to="/checklist-builder">Checklist Audit (Compliance)</NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isPathActive('/audit-reports')}>
                          <NavLink to="/audit-reports">Laporan Inspeksi Temuan</NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Analytics Group */}
        <SidebarGroup className="group-data-[collapsible=icon]:p-0">
          <SidebarGroupLabel className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-2 group-data-[collapsible=icon]:hidden">
            Analytics & Laporan
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => toggleSection('analytics')}
                  tooltip="Analytics & Laporan"
                  className="font-medium text-xs px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center justify-between transition-colors duration-150 overflow-hidden"
                >
                  <BarChart3 className="w-4 h-4 text-slate-600 shrink-0" />
                  <span className="truncate group-data-[collapsible=icon]:hidden flex-1 text-left">
                    {hasFullAccess ? 'Laporan Global' : role === 'TRAINER' ? 'Laporan Training' : 'Laporan Audit'}
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-data-[collapsible=icon]:hidden shrink-0',
                      expandedSections.analytics ? 'rotate-0' : '-rotate-90'
                    )}
                  />
                </SidebarMenuButton>

                {expandedSections.analytics && (
                  <SidebarMenuSub className="ml-4 border-l border-slate-200 pl-2 space-y-1 pt-1 group-data-[collapsible=icon]:hidden">
                    {/* Training Reports */}
                    {hasTrainingAccess && (
                      <>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isPathActive('/analytics/leaderboard')}>
                            <NavLink to="/analytics/leaderboard">Papan Peringkat (XP)</NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isPathActive('/analytics/rank-rewards')}>
                            <NavLink to="/analytics/rank-rewards">Hadiah Level (Rewards)</NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isPathActive('/analytics/quiz-history')}>
                            <NavLink to="/analytics/quiz-history">Riwayat Kuis Peserta</NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </>
                    )}

                    {/* Audit Reports */}
                    {hasAuditAccess && (
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isPathActive('/analytics/audit')}>
                          <NavLink to="/analytics/audit">Laporan Audit Outlet</NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* SOP Group (Accessible to all) */}
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
                  className="font-medium text-xs px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center justify-between transition-colors duration-150 overflow-hidden"
                >
                  <FileText className="w-4 h-4 text-slate-600 shrink-0" />
                  <span className="truncate group-data-[collapsible=icon]:hidden flex-1 text-left">
                    Pustaka SOP
                  </span>
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
                    {hasFullAccess && (
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isPathActive('/sop/management')}>
                          <NavLink to="/sop/management">Unggah Dokumen SOP</NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Role Switcher */}
      <SidebarFooter className="p-3 border-t border-slate-100 bg-slate-50/70 space-y-2 group-data-[collapsible=icon]:p-2">
        {/* User Card */}
        <div className="flex items-center justify-between gap-2 min-w-0 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#419CC3] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
              <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded border ${badge.bg} ${badge.color} ${badge.border}`}>
                {badge.label}
              </span>
            </div>
          </div>

          <NavLink
            to="/login"
            onClick={logout}
            title="Keluar"
            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </NavLink>
        </div>

        {/* Quick Role Switcher for Testing */}
        <div className="pt-2 border-t border-slate-200/60 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#419CC3]" /> Switch Role:
            </span>
          </div>
          <select
            value={role}
            onChange={(e) => switchRole(e.target.value as UserRole)}
            className="w-full text-[11px] font-bold bg-white border border-slate-300 rounded-md py-1 px-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#419CC3]"
          >
            <option value="SUPER_ADMIN">👑 Super Admin (Full Access)</option>
            <option value="HRBP_MANAGER">💼 Manager HRBP (Full Access)</option>
            <option value="TRAINER">🎓 Trainer (Training & In-House)</option>
            <option value="AUDITOR">🔍 Auditor (Audit & Outlets)</option>
          </select>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

