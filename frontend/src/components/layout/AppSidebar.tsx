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
  Trophy,
  Award,
  HelpCircle,
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
import logoTnd from '@/assets/logo tnd.png';

export const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { user, role, switchRole, logout } = useAuth();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    inhouse: true,
    audit: true,
    gamification: true,
    sop: true,
    certificates: true,
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
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0 bg-slate-50 border border-slate-200/80 p-0.5">
            <img src={logoTnd} alt="TND Logo" className="w-full h-full object-contain" />
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

              {/* Manajemen Karyawan */}
              {hasFullAccess && (
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
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isPathActive('/analytics/training-report') || isPathActive('/analytics/training')}>
                          <NavLink to="/analytics/training-report">Laporan Training</NavLink>
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
                        <SidebarMenuSubButton asChild isActive={isPathActive('/audit-reports') || isPathActive('/analytics/audit')}>
                          <NavLink to="/audit-reports">Laporan Audit Outlet</NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Gamification & Leaderboard Group */}
        {hasTrainingAccess && (
          <SidebarGroup className="group-data-[collapsible=icon]:p-0">
            <SidebarGroupLabel className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-2 group-data-[collapsible=icon]:hidden">
              Gamifikasi & Peringkat
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => toggleSection('gamification')}
                    tooltip="Papan Peringkat"
                    className="font-medium text-xs px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center justify-between transition-colors duration-150 overflow-hidden"
                  >
                    <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="truncate group-data-[collapsible=icon]:hidden flex-1 text-left">
                      Peringkat & Hadiah
                    </span>
                    <ChevronDown
                      className={cn(
                        'w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-data-[collapsible=icon]:hidden shrink-0',
                        expandedSections.gamification ? 'rotate-0' : '-rotate-90'
                      )}
                    />
                  </SidebarMenuButton>

                  {expandedSections.gamification && (
                    <SidebarMenuSub className="ml-4 border-l border-slate-200 pl-2 space-y-1 pt-1 group-data-[collapsible=icon]:hidden">
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
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Certificates Group (Trainer, Super Admin, HRBP) */}
        {hasTrainingAccess && (
          <SidebarGroup className="group-data-[collapsible=icon]:p-0">
            <SidebarGroupLabel className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-2 group-data-[collapsible=icon]:hidden">
              Sertifikasi & Kelulusan
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => toggleSection('certificates')}
                    tooltip="Sertifikat"
                    className="font-medium text-xs px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center justify-between transition-colors duration-150 overflow-hidden"
                  >
                    <Award className="w-4 h-4 text-[#0F4F68] shrink-0" />
                    <span className="truncate group-data-[collapsible=icon]:hidden flex-1 text-left">
                      Sertifikat Kelulusan
                    </span>
                    <ChevronDown
                      className={cn(
                        'w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-data-[collapsible=icon]:hidden shrink-0',
                        expandedSections.certificates ? 'rotate-0' : '-rotate-90'
                      )}
                    />
                  </SidebarMenuButton>

                  {expandedSections.certificates && (
                    <SidebarMenuSub className="ml-4 border-l border-slate-200 pl-2 space-y-1 pt-1 group-data-[collapsible=icon]:hidden">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isPathActive('/certificates/templates')}>
                          <NavLink to="/certificates/templates">Desain Template</NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isPathActive('/certificates/issued')}>
                          <NavLink to="/certificates/issued">Sertifikat Terbit</NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isPathActive('/certificates/mine')}>
                          <NavLink to="/certificates/mine">Sertifikat Saya</NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

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
                          <NavLink to="/sop/management">Upload Dokumen</NavLink>
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

      {/* Footer */}
      <SidebarFooter className="p-3 border-t border-slate-100 space-y-2 group-data-[collapsible=icon]:p-1.5">
        {/* Role Switcher */}
        <div className="flex flex-col gap-1.5 group-data-[collapsible=icon]:hidden">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Peran Aktif
          </label>
          <div className="relative">
            <select
              value={role}
              onChange={(e) => switchRole(e.target.value as UserRole)}
              className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#419CC3] pr-7"
            >
              <option value="SUPER_ADMIN">👑 Super Admin</option>
              <option value="HRBP_MANAGER">👔 HRBP Manager</option>
              <option value="TRAINER">🎓 Trainer</option>
              <option value="AUDITOR">🛡️ Auditor</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:justify-center">
          <div className="w-8 h-8 rounded-full bg-[#0F4F68] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {initials}
          </div>
          <div className="flex flex-col min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-xs text-slate-800 truncate leading-tight">
              {user.name || 'User'}
            </span>
            <span className={cn('text-[10px] font-semibold truncate', badge.color)}>
              {badge.label}
            </span>
          </div>
          <button
            onClick={logout}
            title="Keluar"
            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors group-data-[collapsible=icon]:hidden"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};
