import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Modal,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import {
  fetchOutletsApi,
  fetchInHouseSessionsApi,
  fetchAuditInspectionsApi,
} from '../../src/services/api';
import { InHouseAssessmentBottomSheet } from '../../src/components/training/InHouseAssessmentBottomSheet';
import { AuditInspectionBottomSheet } from '../../src/components/audit/AuditInspectionBottomSheet';
import { BrandHeader, BrandStatusScrim } from '../../src/components/ui/BrandHeader';
import { Card } from '../../src/components/ui/Card';
import { GradeBadge } from '../../src/components/ui/GradeBadge';
import { COLORS, RADIUS, SHADOW, TOUCH_MIN, TYPE, GRADE_COLOR } from '../../src/theme';

interface ActivityItem {
  id: string;
  _type: 'training' | 'audit';
  outlet_id?: string;
  outlet_name: string;
  division?: string;
  dateStr: string;
  timestamp: number;
  score: number;
  grade?: 'SB' | 'B' | 'C' | 'K';
  is_passed?: boolean;
  is_compliant?: boolean;
  evaluator_name: string;
  target_name?: string;
  ok_items?: number;
  nok_items?: number;
  findings?: Array<{
    point_text?: string;
    notes?: string;
    photo_path?: string;
    photo_uri?: string;
    is_compliant?: boolean;
  }>;
  notes?: string;
  checklists?: any[];
}

export default function RiwayatScreen() {
  const { user } = useAuth();
  const isManager =
    user?.role?.toUpperCase().includes('HRBP') ||
    user?.role?.toUpperCase().includes('MANAGER') ||
    user?.email?.includes('manager');
  const isTrainer = !isManager && (user?.role?.toUpperCase().includes('TRAINER') || user?.email?.includes('trainer'));

  const [activeTab, setActiveTab] = useState<'all' | 'training' | 'audit'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Raw data from APIs
  const [trainingSessions, setTrainingSessions] = useState<any[]>([]);
  const [auditInspections, setAuditInspections] = useState<any[]>([]);
  const [outletsList, setOutletsList] = useState<any[]>([]);

  // Selected detail modal
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // On-Demand "+ Mulai Baru" states
  const [isStartActionModalOpen, setIsStartActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'training' | 'audit' | null>(null);
  const [isOutletPickerOpen, setIsOutletPickerOpen] = useState(false);
  const [outletSearchQuery, setOutletSearchQuery] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState<any | null>(null);
  const [isTrainingSheetOpen, setIsTrainingSheetOpen] = useState(false);
  const [isAuditSheetOpen, setIsAuditSheetOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [outlets, sessions, audits] = await Promise.all([
        fetchOutletsApi(),
        fetchInHouseSessionsApi(),
        fetchAuditInspectionsApi(),
      ]);

      if (Array.isArray(outlets)) setOutletsList(outlets);
      if (Array.isArray(sessions)) setTrainingSessions(sessions);
      if (Array.isArray(audits)) setAuditInspections(audits);
    } catch (error) {
      console.error('Error loading history data:', error);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    loadData().finally(() => setIsLoading(false));
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData().finally(() => setIsRefreshing(false));
  }, [loadData]);

  // Combine and format history items
  const combinedActivities = useMemo<ActivityItem[]>(() => {
    const formattedSessions: ActivityItem[] = trainingSessions.map((s: any) => {
      const dateVal = s.training_date ? new Date(s.training_date) : new Date();
      return {
        id: s.id || `tr-${Math.random()}`,
        _type: 'training',
        outlet_id: s.outlet_id,
        outlet_name: s.outlet_name || s.outlet?.name || 'Gerai Tanpa Nama',
        division: s.outlet?.division || 'Cabang Operasional',
        dateStr: dateVal.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        timestamp: dateVal.getTime(),
        score: Math.round(s.percentage || s.total_score || 85),
        grade: (s.grade || 'B') as 'SB' | 'B' | 'C' | 'K',
        is_passed: s.is_passed !== false,
        evaluator_name: s.trainer_name || 'Trainer TnD',
        target_name: s.trainee_name || 'Tim Staf & Barista',
        notes: s.notes || s.trainer_notes,
        checklists: s.checklists || s.items || [],
      };
    });

    const formattedAudits: ActivityItem[] = auditInspections.map((a: any) => {
      const dateVal = a.inspection_date ? new Date(a.inspection_date) : new Date();
      return {
        id: a.id || `aud-${Math.random()}`,
        _type: 'audit',
        outlet_id: a.outlet_id,
        outlet_name: a.outlet_name || 'Gerai Tanpa Nama',
        division: a.division || 'Cabang Operasional',
        dateStr: dateVal.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        timestamp: dateVal.getTime(),
        score: Math.round(a.compliance_score || 85),
        is_compliant: Boolean(a.is_compliant),
        ok_items: a.ok_items || (a.total_items ? a.total_items - (a.nok_items || 0) : 18),
        nok_items: a.nok_items ?? (a.findings?.length || 0),
        evaluator_name: a.auditor_name || 'Auditor Lapangan',
        target_name: a.pic_name || 'Store Manager / PIC',
        findings: a.findings || [],
        notes: a.notes,
      };
    });

    const merged = [...formattedSessions, ...formattedAudits];
    merged.sort((a, b) => b.timestamp - a.timestamp);
    return merged;
  }, [trainingSessions, auditInspections]);

  // Filtered by role, active tab and search query
  const filteredActivities = useMemo(() => {
    return combinedActivities.filter((item) => {
      // Strict RBAC: Trainer only sees training, Auditor only sees audit
      if (isTrainer && item._type !== 'training') return false;
      if (!isManager && !isTrainer && item._type !== 'audit') return false;

      if (isTrainer) {
        if (activeTab === 'training' && !item.is_passed) return false;
        if (activeTab === 'audit' && item.is_passed) return false;
      } else if (!isManager) {
        if (activeTab === 'training' && !item.is_compliant) return false;
        if (activeTab === 'audit' && item.is_compliant) return false;
      } else {
        if (activeTab === 'training' && item._type !== 'training') return false;
        if (activeTab === 'audit' && item._type !== 'audit') return false;
      }

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.outlet_name.toLowerCase().includes(q) ||
        (item.division && item.division.toLowerCase().includes(q)) ||
        item.evaluator_name.toLowerCase().includes(q) ||
        (item.target_name && item.target_name.toLowerCase().includes(q))
      );
    });
  }, [combinedActivities, activeTab, searchQuery, isTrainer, isManager]);

  // Handler to open detail
  const handleOpenDetail = (item: ActivityItem) => {
    setSelectedActivity(item);
    setIsDetailModalOpen(true);
  };

  // Handler to open start session based on role
  const handleOpenStartModal = () => {
    if (isTrainer) {
      handleChooseActivityType('training');
      return;
    }
    if (!isManager) {
      handleChooseActivityType('audit');
      return;
    }
    setIsStartActionModalOpen(true);
  };

  // Handler to start new on-demand activity with RBAC guard
  const handleChooseActivityType = (type: 'training' | 'audit') => {
    if (type === 'audit' && isTrainer) return;
    if (type === 'training' && !isTrainer && !isManager) return;
    setActionType(type);
    setIsStartActionModalOpen(false);
    setOutletSearchQuery('');
    setIsOutletPickerOpen(true);
  };

  const handleSelectOutlet = (outlet: any) => {
    setSelectedOutlet(outlet);
    setIsOutletPickerOpen(false);
    if (actionType === 'training') {
      setIsTrainingSheetOpen(true);
    } else if (actionType === 'audit') {
      setIsAuditSheetOpen(true);
    }
  };

  // Fallback outlets if empty
  const defaultFallbackOutlets = [
    { id: '1', name: 'Outlet Senayan City', division: 'Jakarta Selatan' },
    { id: '2', name: 'Outlet Central Park', division: 'Jakarta Barat' },
    { id: '3', name: 'Outlet Grand Indonesia', division: 'Jakarta Pusat' },
    { id: '4', name: 'Outlet BSD City', division: 'Tangerang Selatan' },
    { id: '5', name: 'Outlet Kelapa Gading', division: 'Jakarta Utara' },
  ];
  const availableOutlets = outletsList.length > 0 ? outletsList : defaultFallbackOutlets;
  const filteredOutlets = availableOutlets.filter(
    (o) =>
      o.name.toLowerCase().includes(outletSearchQuery.toLowerCase()) ||
      (o.division && o.division.toLowerCase().includes(outletSearchQuery.toLowerCase()))
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <BrandStatusScrim />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
            progressViewOffset={60}
          />
        }
      >
        <BrandHeader
          title="Riwayat Aktivitas"
          subtitle={
            isTrainer
              ? 'Histori evaluasi & asesmen kompetensi barista cabang'
              : !isManager
              ? 'Histori inspeksi kepatuhan & temuan audit gerai'
              : 'Histori sesi evaluasi in-house training & inspeksi audit gerai'
          }
          overlap
          right={
            <TouchableOpacity
              onPress={handleOpenStartModal}
              accessibilityRole="button"
              accessibilityLabel="Mulai aktivitas baru"
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                backgroundColor: '#FFFFFF',
                paddingHorizontal: 12,
                paddingVertical: 7,
                borderRadius: RADIUS.pill,
                ...SHADOW.card,
              }}
            >
              <MaterialIcons name="add" size={17} color={COLORS.brandDeep} />
              <Text style={{ fontSize: 12, fontWeight: '800', color: COLORS.brandDeep }}>
                {isTrainer ? 'Mulai Training' : !isManager ? 'Mulai Audit' : 'Mulai Baru'}
              </Text>
            </TouchableOpacity>
          }
        >
          {/* Header Stat Strip */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 22,
              paddingVertical: 14,
              borderRadius: RADIUS.lg,
              backgroundColor: 'rgba(255,255,255,0.10)',
            }}
          >
            {isTrainer ? (
              <>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF' }}>
                    {trainingSessions.length}
                  </Text>
                  <Text style={{ ...TYPE.micro, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>Sesi Training</Text>
                </View>
                <View style={{ width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.18)' }} />
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF' }}>
                    {trainingSessions.filter((s: any) => s.is_passed !== false).length}
                  </Text>
                  <Text style={{ ...TYPE.micro, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>Lulus Sesi</Text>
                </View>
                <View style={{ width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.18)' }} />
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF' }}>
                    {trainingSessions.filter((s: any) => s.is_passed === false).length}
                  </Text>
                  <Text style={{ ...TYPE.micro, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>Re-Training</Text>
                </View>
              </>
            ) : !isManager ? (
              <>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF' }}>
                    {auditInspections.length}
                  </Text>
                  <Text style={{ ...TYPE.micro, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>Total Audit</Text>
                </View>
                <View style={{ width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.18)' }} />
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF' }}>
                    {auditInspections.filter((a: any) => a.is_compliant).length}
                  </Text>
                  <Text style={{ ...TYPE.micro, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>Gerai Patuh</Text>
                </View>
                <View style={{ width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.18)' }} />
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF' }}>
                    {auditInspections.filter((a: any) => !a.is_compliant).length}
                  </Text>
                  <Text style={{ ...TYPE.micro, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>Ada Temuan</Text>
                </View>
              </>
            ) : (
              <>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF' }}>
                    {combinedActivities.length}
                  </Text>
                  <Text style={{ ...TYPE.micro, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>Total Riwayat</Text>
                </View>
                <View style={{ width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.18)' }} />
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF' }}>
                    {trainingSessions.length}
                  </Text>
                  <Text style={{ ...TYPE.micro, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>Sesi Training</Text>
                </View>
                <View style={{ width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.18)' }} />
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF' }}>
                    {auditInspections.length}
                  </Text>
                  <Text style={{ ...TYPE.micro, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>Audit Gerai</Text>
                </View>
              </>
            )}
          </View>
        </BrandHeader>

        <View style={{ paddingHorizontal: 20 }}>
          {/* Filter & Search Bar */}
          <View style={{ marginTop: -26, ...SHADOW.raised }}>
            <Card style={{ padding: 14 }}>
              {/* Segmented Filter */}
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: COLORS.surfaceSunken,
                  borderRadius: RADIUS.md,
                  padding: 4,
                  marginBottom: 12,
                }}
              >
                <TouchableOpacity
                  onPress={() => setActiveTab('all')}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    alignItems: 'center',
                    borderRadius: RADIUS.sm,
                    backgroundColor: activeTab === 'all' ? COLORS.surface : 'transparent',
                    ...((activeTab === 'all' ? SHADOW.card : {}) as any),
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12.5,
                      fontWeight: activeTab === 'all' ? '800' : '600',
                      color: activeTab === 'all' ? COLORS.textMain : COLORS.textSecondary,
                    }}
                  >
                    {isTrainer ? `Semua Sesi (${trainingSessions.length})` : !isManager ? `Semua Audit (${auditInspections.length})` : `Semua (${combinedActivities.length})`}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setActiveTab('training')}
                  activeOpacity={0.8}
                  style={{
                    flex: 1.2,
                    paddingVertical: 8,
                    alignItems: 'center',
                    borderRadius: RADIUS.sm,
                    backgroundColor: activeTab === 'training' ? COLORS.surface : 'transparent',
                    ...((activeTab === 'training' ? SHADOW.card : {}) as any),
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12.5,
                      fontWeight: activeTab === 'training' ? '800' : '600',
                      color: activeTab === 'training' ? COLORS.primary : COLORS.textSecondary,
                    }}
                  >
                    {isTrainer ? 'Lulus Sesi' : !isManager ? 'Compliant (OK)' : `In-House (${trainingSessions.length})`}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setActiveTab('audit')}
                  activeOpacity={0.8}
                  style={{
                    flex: 1.1,
                    paddingVertical: 8,
                    alignItems: 'center',
                    borderRadius: RADIUS.sm,
                    backgroundColor: activeTab === 'audit' ? COLORS.surface : 'transparent',
                    ...((activeTab === 'audit' ? SHADOW.card : {}) as any),
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12.5,
                      fontWeight: activeTab === 'audit' ? '800' : '600',
                      color: activeTab === 'audit' ? (isTrainer ? COLORS.danger : COLORS.success) : COLORS.textSecondary,
                    }}
                  >
                    {isTrainer ? 'Re-Training' : !isManager ? 'Temuan (NOK)' : `Audit (${auditInspections.length})`}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Search Box */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: COLORS.surfaceSunken,
                  borderRadius: RADIUS.md,
                  paddingHorizontal: 12,
                  height: 42,
                }}
              >
                <MaterialIcons name="search" size={20} color={COLORS.textMuted} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Cari riwayat gerai, asesor, auditor..."
                  placeholderTextColor={COLORS.textMuted}
                  style={{ flex: 1, marginLeft: 8, fontSize: 13, color: COLORS.textMain }}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <MaterialIcons name="close" size={18} color={COLORS.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
            </Card>
          </View>

          {/* List Title */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 12 }}>
            <Text style={{ ...TYPE.h3, fontSize: 14.5, color: COLORS.textMain }}>
              Daftar Riwayat ({filteredActivities.length})
            </Text>
            <Text style={{ ...TYPE.micro, color: COLORS.textSecondary }}>Urutkan: Terbaru</Text>
          </View>

          {/* Empty State */}
          {filteredActivities.length === 0 && !isLoading && (
            <Card style={{ padding: 32, alignItems: 'center', justifyContent: 'center' }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: COLORS.surfaceSunken,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <MaterialIcons name="history" size={28} color={COLORS.textMuted} />
              </View>
              <Text style={{ ...TYPE.h3, color: COLORS.textMain, marginBottom: 4 }}>
                Belum Ada Riwayat
              </Text>
              <Text style={{ ...TYPE.label, color: COLORS.textSecondary, textAlign: 'center', maxWidth: 240, marginBottom: 16 }}>
                {searchQuery
                  ? 'Tidak ada histori yang cocok dengan pencarian Anda.'
                  : 'Mulai aktivitas in-house training atau audit sekarang untuk mencatat riwayat.'}
              </Text>
              <TouchableOpacity
                onPress={() => setIsStartActionModalOpen(true)}
                activeOpacity={0.8}
                style={{
                  backgroundColor: COLORS.primary,
                  paddingHorizontal: 16,
                  paddingVertical: 9,
                  borderRadius: RADIUS.pill,
                }}
              >
                <Text style={{ fontSize: 12.5, fontWeight: '700', color: '#FFFFFF' }}>+ Mulai Sesi Baru</Text>
              </TouchableOpacity>
            </Card>
          )}

          {/* History Item Cards */}
          <View style={{ gap: 11 }}>
            {filteredActivities.map((item) => {
              const isAudit = item._type === 'audit';
              const isPassed = isAudit ? item.is_compliant : item.is_passed;
              const statusColor = isPassed ? COLORS.success : COLORS.danger;

              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleOpenDetail(item)}
                  activeOpacity={0.82}
                >
                  <Card padded={false} style={{ overflow: 'hidden' }}>
                    <View style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
                      {/* Top Row: Activity Badge & Date */}
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 5,
                            backgroundColor: isAudit ? COLORS.successLight : COLORS.primaryLight,
                            paddingHorizontal: 8.5,
                            paddingVertical: 3.5,
                            borderRadius: RADIUS.pill,
                          }}
                        >
                          <MaterialIcons
                            name={isAudit ? 'fact-check' : 'school'}
                            size={13}
                            color={isAudit ? COLORS.success : COLORS.primary}
                          />
                          <Text
                            style={{
                              ...TYPE.micro,
                              fontSize: 10.5,
                              fontWeight: '800',
                              color: isAudit ? COLORS.success : COLORS.primary,
                            }}
                          >
                            {isAudit ? 'AUDIT LAPANGAN' : 'IN-HOUSE TRAINING'}
                          </Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <MaterialIcons name="calendar-today" size={12} color={COLORS.textMuted} />
                          <Text style={{ ...TYPE.micro, color: COLORS.textMuted }}>{item.dateStr}</Text>
                        </View>
                      </View>

                      {/* Main Outlet & Score Row */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ ...TYPE.h3, fontSize: 15.5, color: COLORS.textMain }} numberOfLines={1}>
                            {item.outlet_name}
                          </Text>
                          <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }} numberOfLines={1}>
                            {item.division}
                          </Text>
                        </View>

                        {/* Right Score Pill */}
                        <View style={{ alignItems: 'flex-end' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            {!isAudit && item.grade && <GradeBadge grade={item.grade} />}
                            <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.textMain, letterSpacing: -0.5 }}>
                              {item.score}%
                            </Text>
                          </View>
                          <Text
                            style={{
                              ...TYPE.micro,
                              fontSize: 10.5,
                              color: statusColor,
                              fontWeight: '700',
                              marginTop: 1,
                            }}
                          >
                            {isAudit
                              ? item.is_compliant
                                ? 'COMPLIANT (OK)'
                                : `NON-COMPLIANT (${item.nok_items || 0} NOK)`
                              : item.is_passed
                              ? 'LULUS EVALUASI'
                              : 'PERLU RE-TRAINING'}
                          </Text>
                        </View>
                      </View>

                      {/* Bottom Person Row & Detail Link */}
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 12,
                          paddingTop: 10,
                          borderTopWidth: 1,
                          borderTopColor: COLORS.divider,
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 }}>
                          <MaterialIcons name="person" size={14} color={COLORS.textMuted} />
                          <Text style={{ fontSize: 11.5, color: COLORS.textSecondary }} numberOfLines={1}>
                            {isAudit ? `Auditor: ${item.evaluator_name}` : `Trainer: ${item.evaluator_name}`}
                          </Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                          <Text style={{ fontSize: 11.5, fontWeight: '700', color: COLORS.primary }}>Rincian</Text>
                          <MaterialIcons name="chevron-right" size={15} color={COLORS.primary} />
                        </View>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* ================= MODAL DETAIL RIWAYAT AKTIVITAS ================= */}
      <Modal
        visible={isDetailModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsDetailModalOpen(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: COLORS.surface,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              paddingTop: 20,
              paddingBottom: 34,
              maxHeight: Dimensions.get('window').height * 0.88,
            }}
          >
            {/* Modal Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 }}>
              <View>
                <View
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: selectedActivity?._type === 'audit' ? COLORS.successLight : COLORS.primaryLight,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: RADIUS.pill,
                    marginBottom: 4,
                  }}
                >
                  <Text
                    style={{
                      ...TYPE.micro,
                      fontWeight: '800',
                      color: selectedActivity?._type === 'audit' ? COLORS.success : COLORS.primary,
                    }}
                  >
                    {selectedActivity?._type === 'audit' ? 'DETAIL AUDIT LAPANGAN' : 'DETAIL IN-HOUSE TRAINING'}
                  </Text>
                </View>
                <Text style={{ ...TYPE.h2, fontSize: 18, color: COLORS.textMain }}>
                  {selectedActivity?.outlet_name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsDetailModalOpen(false)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: COLORS.surfaceSunken,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons name="close" size={20} color={COLORS.textMain} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ paddingHorizontal: 20 }}>
              {selectedActivity && (
                <View style={{ gap: 14, paddingBottom: 20 }}>
                  {/* Summary Metric Card */}
                  <View
                    style={{
                      backgroundColor: COLORS.surfaceSunken,
                      borderRadius: RADIUS.md,
                      padding: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View>
                      <Text style={{ ...TYPE.micro, color: COLORS.textSecondary }}>HASIL AKHIR</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
                        {selectedActivity._type === 'training' && selectedActivity.grade && (
                          <GradeBadge grade={selectedActivity.grade} />
                        )}
                        <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.textMain }}>
                          {selectedActivity.score}%
                        </Text>
                      </View>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ ...TYPE.micro, color: COLORS.textSecondary }}>STATUS</Text>
                      <View
                        style={{
                          backgroundColor:
                            (selectedActivity._type === 'audit' ? selectedActivity.is_compliant : selectedActivity.is_passed)
                              ? COLORS.successLight
                              : COLORS.dangerLight,
                          paddingHorizontal: 10,
                          paddingVertical: 4.5,
                          borderRadius: RADIUS.pill,
                          marginTop: 3,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11.5,
                            fontWeight: '800',
                            color:
                              (selectedActivity._type === 'audit' ? selectedActivity.is_compliant : selectedActivity.is_passed)
                                ? COLORS.success
                                : COLORS.danger,
                          }}
                        >
                          {selectedActivity._type === 'audit'
                            ? selectedActivity.is_compliant
                              ? 'COMPLIANT'
                              : 'NON-COMPLIANT'
                            : selectedActivity.is_passed
                            ? 'LULUS SESI'
                            : 'RE-TRAINING'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Metadata Info List */}
                  <View style={{ backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.divider, borderRadius: RADIUS.md, padding: 14, gap: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 12.5, color: COLORS.textSecondary }}>Tanggal Pelaksanaan:</Text>
                      <Text style={{ fontSize: 12.5, fontWeight: '700', color: COLORS.textMain }}>{selectedActivity.dateStr}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 12.5, color: COLORS.textSecondary }}>
                        {selectedActivity._type === 'audit' ? 'Auditor:' : 'Trainer / Asesor:'}
                      </Text>
                      <Text style={{ fontSize: 12.5, fontWeight: '700', color: COLORS.textMain }}>{selectedActivity.evaluator_name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 12.5, color: COLORS.textSecondary }}>
                        {selectedActivity._type === 'audit' ? 'PIC Outlet:' : 'Peserta Training:'}
                      </Text>
                      <Text style={{ fontSize: 12.5, fontWeight: '700', color: COLORS.textMain }}>{selectedActivity.target_name || 'Tim Gerai'}</Text>
                    </View>
                    {selectedActivity._type === 'audit' && (
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 12.5, color: COLORS.textSecondary }}>Kepatuhan Butir:</Text>
                        <Text style={{ fontSize: 12.5, fontWeight: '700', color: COLORS.textMain }}>
                          {selectedActivity.ok_items} Sesuai • {selectedActivity.nok_items} Temuan
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Audit Findings List if audit */}
                  {selectedActivity._type === 'audit' && (
                    <View style={{ marginTop: 6 }}>
                      <Text style={{ ...TYPE.h3, fontSize: 14, color: COLORS.textMain, marginBottom: 8 }}>
                        Daftar Temuan Ketidaksesuaian ({selectedActivity.findings?.length || 0}):
                      </Text>

                      {selectedActivity.findings && selectedActivity.findings.length > 0 ? (
                        <View style={{ gap: 8 }}>
                          {selectedActivity.findings.map((f, fIdx) => (
                            <View
                              key={fIdx}
                              style={{
                                backgroundColor: COLORS.dangerLight,
                                borderWidth: 1,
                                borderColor: COLORS.danger,
                                borderRadius: RADIUS.md,
                                padding: 12,
                                gap: 4,
                              }}
                            >
                              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
                                <MaterialIcons name="warning" size={16} color={COLORS.danger} style={{ marginTop: 1 }} />
                                <Text style={{ flex: 1, fontSize: 13, fontWeight: '700', color: COLORS.textMain }}>
                                  {f.point_text || 'Item Checklist Audit'}
                                </Text>
                              </View>
                              {f.notes && (
                                <Text style={{ fontSize: 11.5, color: COLORS.danger, marginLeft: 22 }}>
                                  Catatan: {f.notes}
                                </Text>
                              )}
                            </View>
                          ))}
                        </View>
                      ) : (
                        <View
                          style={{
                            backgroundColor: COLORS.successLight,
                            padding: 14,
                            borderRadius: RADIUS.md,
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ fontSize: 12.5, fontWeight: '700', color: COLORS.success }}>
                            ✅ Seluruh butir checklist terpenuhi (Nihil Temuan).
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* General Notes */}
                  {selectedActivity.notes && (
                    <View style={{ backgroundColor: COLORS.surfaceSunken, padding: 12, borderRadius: RADIUS.md, marginTop: 4 }}>
                      <Text style={{ ...TYPE.micro, color: COLORS.textSecondary, marginBottom: 4 }}>CATATAN UMUM</Text>
                      <Text style={{ fontSize: 12.5, color: COLORS.textMain, fontStyle: 'italic', lineHeight: 18 }}>
                        "{selectedActivity.notes}"
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL PILIH TIPE AKTIVITAS "+ MULAI BARU" ================= */}
      <Modal
        visible={isStartActionModalOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setIsStartActionModalOpen(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <View style={{ width: '100%', maxWidth: 360, backgroundColor: COLORS.surface, borderRadius: 24, padding: 22 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <View>
                <Text style={{ ...TYPE.h2, fontSize: 17, color: COLORS.textMain }}>Mulai Sesi Baru</Text>
                <Text style={{ ...TYPE.micro, color: COLORS.textSecondary, marginTop: 2 }}>Jadwal Bebas & On-Demand</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsStartActionModalOpen(false)}
                style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.surfaceSunken, alignItems: 'center', justifyContent: 'center' }}
              >
                <MaterialIcons name="close" size={18} color={COLORS.textMain} />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 12.5, color: COLORS.textSecondary, marginBottom: 16, lineHeight: 18 }}>
              Pilih jenis evaluasi yang ingin Anda jalankan secara langsung:
            </Text>

            <View style={{ gap: 10 }}>
              <TouchableOpacity
                onPress={() => handleChooseActivityType('training')}
                activeOpacity={0.85}
                style={{
                  backgroundColor: COLORS.primaryLight,
                  borderRadius: RADIUS.md,
                  padding: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  borderWidth: 1.5,
                  borderColor: COLORS.primary,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: COLORS.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MaterialIcons name="school" size={22} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: COLORS.primary }}>In-House Training</Text>
                  <Text style={{ fontSize: 11.5, color: COLORS.textSecondary, marginTop: 1 }}>Asesmen kompetensi staf gerai</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={COLORS.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleChooseActivityType('audit')}
                activeOpacity={0.85}
                style={{
                  backgroundColor: COLORS.successLight,
                  borderRadius: RADIUS.md,
                  padding: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  borderWidth: 1.5,
                  borderColor: COLORS.success,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: COLORS.success,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MaterialIcons name="fact-check" size={22} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: COLORS.success }}>Audit Lapangan</Text>
                  <Text style={{ fontSize: 11.5, color: COLORS.textSecondary, marginTop: 1 }}>Checklist kepatuhan & temuan gerai</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={COLORS.success} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL PEMILIHAN OUTLET ================= */}
      <Modal
        visible={isOutletPickerOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsOutletPickerOpen(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: COLORS.surface,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              paddingTop: 20,
              paddingBottom: 34,
              maxHeight: Dimensions.get('window').height * 0.8,
            }}
          >
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 }}>
              <View>
                <Text style={{ ...TYPE.h2, fontSize: 17, color: COLORS.textMain }}>
                  {actionType === 'audit' ? 'Pilih Gerai untuk Audit Lapangan' : 'Pilih Gerai untuk In-House Training'}
                </Text>
                <Text style={{ ...TYPE.micro, color: COLORS.textSecondary, marginTop: 2 }}>
                  Jadwal Bebas • Pilih gerai untuk memulai on-demand
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsOutletPickerOpen(false)}
                style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.surfaceSunken, alignItems: 'center', justifyContent: 'center' }}
              >
                <MaterialIcons name="close" size={20} color={COLORS.textMain} />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={{ paddingHorizontal: 20, marginBottom: 14 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: COLORS.surfaceSunken,
                  borderRadius: RADIUS.md,
                  paddingHorizontal: 12,
                  height: 44,
                }}
              >
                <MaterialIcons name="search" size={20} color={COLORS.textMuted} />
                <TextInput
                  value={outletSearchQuery}
                  onChangeText={setOutletSearchQuery}
                  placeholder="Cari nama gerai atau wilayah..."
                  placeholderTextColor={COLORS.textMuted}
                  style={{ flex: 1, marginLeft: 8, fontSize: 14, color: COLORS.textMain }}
                />
              </View>
            </View>

            {/* Outlet List */}
            <ScrollView style={{ paddingHorizontal: 20 }}>
              {filteredOutlets.map((outlet, idx) => (
                <TouchableOpacity
                  key={outlet.id || idx}
                  onPress={() => handleSelectOutlet(outlet)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 14,
                    borderBottomWidth: idx < filteredOutlets.length - 1 ? 1 : 0,
                    borderBottomColor: COLORS.divider,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: RADIUS.sm,
                        backgroundColor: actionType === 'audit' ? COLORS.successLight : COLORS.primaryLight,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MaterialIcons
                        name={actionType === 'audit' ? 'storefront' : 'school'}
                        size={20}
                        color={actionType === 'audit' ? COLORS.success : COLORS.primary}
                      />
                    </View>
                    <View>
                      <Text style={{ ...TYPE.h3, fontSize: 14.5, color: COLORS.textMain }}>{outlet.name}</Text>
                      <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>{outlet.division || 'Area Operasional'}</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      backgroundColor: actionType === 'audit' ? COLORS.successLight : COLORS.primaryLight,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: RADIUS.pill,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: actionType === 'audit' ? COLORS.success : COLORS.primary,
                      }}
                    >
                      Mulai
                    </Text>
                    <MaterialIcons
                      name="arrow-forward"
                      size={14}
                      color={actionType === 'audit' ? COLORS.success : COLORS.primary}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ================= BOTTOM SHEETS UNTUK EKSEKUSI ================= */}
      {selectedOutlet && (
        <>
          <AuditInspectionBottomSheet
            visible={isAuditSheetOpen}
            outlet={selectedOutlet}
            auditorName={user?.name || (isManager ? 'Rian (HRBP Manager)' : 'Auditor Lapangan')}
            onClose={() => setIsAuditSheetOpen(false)}
            onSuccess={() => {
              setIsAuditSheetOpen(false);
              loadData();
            }}
          />

          <InHouseAssessmentBottomSheet
            visible={isTrainingSheetOpen}
            outlet={selectedOutlet}
            trainerName={user?.name || (isManager ? 'Rian (HRBP Manager)' : 'Trainer TnD')}
            onClose={() => setIsTrainingSheetOpen(false)}
            onSuccess={() => {
              setIsTrainingSheetOpen(false);
              loadData();
            }}
          />
        </>
      )}
    </View>
  );
}
