import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import {
  fetchInHouseSessionsApi,
  fetchOutletsApi,
  fetchAuditInspectionsApi,
} from '../../src/services/api';
import { InHouseAssessmentBottomSheet } from '../../src/components/training/InHouseAssessmentBottomSheet';
import { AuditInspectionBottomSheet } from '../../src/components/audit/AuditInspectionBottomSheet';
import { BrandHeader, BrandStatusScrim } from '../../src/components/ui/BrandHeader';
import { Card } from '../../src/components/ui/Card';
import { Avatar } from '../../src/components/ui/Avatar';
import { GradeBadge } from '../../src/components/ui/GradeBadge';
import { COLORS, RADIUS, SHADOW, TOUCH_MIN, TYPE, GRADE_COLOR } from '../../src/theme';

/** One column of the header stat strip. */
function HeaderStat({ value, label, loading }: { value: string | number; label: string; loading?: boolean }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      {loading ? (
        <View style={{ height: 26, width: 42, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.18)' }} />
      ) : (
        <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.onBrand, letterSpacing: -0.6 }}>{value}</Text>
      )}
      <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.onBrandMuted, marginTop: 4, textAlign: 'center' }}>
        {label}
      </Text>
    </View>
  );
}

function SkeletonRow({ last }: { last?: boolean }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: COLORS.divider,
      }}
    >
      <View style={{ width: 42, height: 42, borderRadius: RADIUS.sm, backgroundColor: COLORS.divider }} />
      <View style={{ flex: 1, gap: 7 }}>
        <View style={{ height: 13, width: '60%', borderRadius: 6, backgroundColor: COLORS.divider }} />
        <View style={{ height: 11, width: '38%', borderRadius: 5, backgroundColor: COLORS.divider }} />
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ openAction?: 'audit' | 'training' }>();
  const { user } = useAuth();

  const isManager =
    user?.role?.toUpperCase().includes('HRBP') ||
    user?.role?.toUpperCase().includes('MANAGER') ||
    user?.email?.includes('manager');
  const isTrainer = !isManager && (user?.role?.toUpperCase().includes('TRAINER') || user?.email?.includes('trainer'));
  const firstName = user?.name ? user.name.split(' ')[0] : isManager ? 'Rian' : isTrainer ? 'Budi' : 'Dian';

  // Trainer data
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  // Auditor data
  const [recentAudits, setRecentAudits] = useState<any[]>([]);

  const [rawOutlets, setRawOutlets] = useState<any[]>([]);
  const [outletsMap, setOutletsMap] = useState<Record<string, string>>({});
  const [outletCount, setOutletCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // On-demand action states
  const [isBackupPickerOpen, setIsBackupPickerOpen] = useState(false);
  const [backupActionType, setBackupActionType] = useState<'audit' | 'training' | null>(null);
  const [outletSearchQuery, setOutletSearchQuery] = useState('');

  // Bottom sheets for executing on-demand actions
  const [selectedOutletForBackup, setSelectedOutletForBackup] = useState<{ id: string; name: string; division?: string } | null>(null);
  const [isAuditSheetOpen, setIsAuditSheetOpen] = useState(false);
  const [isTrainingSheetOpen, setIsTrainingSheetOpen] = useState(false);

  // Manager feed filter: 'all' | 'audit' | 'training'
  const [managerFeedFilter, setManagerFeedFilter] = useState<'all' | 'audit' | 'training'>('all');

  const loadData = useCallback(async () => {
    setLoadError(false);
    try {
      const [outletsData, sessionsData, auditData] = await Promise.all([
        fetchOutletsApi(),
        fetchInHouseSessionsApi(),
        fetchAuditInspectionsApi(),
      ]);
      const oMap: Record<string, string> = {};
      if (Array.isArray(outletsData)) {
        setRawOutlets(outletsData);
        outletsData.forEach((o: any) => {
          if (o.id) oMap[o.id] = o.name;
        });
        setOutletCount(outletsData.length);
      }
      setOutletsMap(oMap);
      setRecentSessions(Array.isArray(sessionsData) ? sessionsData : []);
      setRecentAudits(Array.isArray(auditData) ? auditData : []);
    } catch {
      setLoadError(true);
    }
  }, []);

  const handleStartActivity = useCallback((actionType: 'audit' | 'training') => {
    if (actionType === 'audit' && isTrainer) {
      Alert.alert('Akses Dibatasi', 'Peran Trainer hanya berwenang untuk evaluasi In-House Training.');
      return;
    }
    if (actionType === 'training' && !isTrainer && !isManager) {
      Alert.alert('Akses Dibatasi', 'Peran Auditor hanya berwenang untuk inspeksi Audit Lapangan.');
      return;
    }
    setBackupActionType(actionType);
    setOutletSearchQuery('');
    setIsBackupPickerOpen(true);
  }, [isTrainer, isManager]);

  useEffect(() => {
    if (params.openAction === 'audit' || params.openAction === 'training') {
      handleStartActivity(params.openAction);
    }
  }, [params.openAction, handleStartActivity]);

  useEffect(() => {
    setIsLoading(true);
    loadData().finally(() => setIsLoading(false));
  }, [user, isManager, isTrainer, loadData]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData().finally(() => setIsRefreshing(false));
  }, [loadData]);

  // Trainer metrics
  const passedCount = recentSessions.filter((s) => s.is_passed).length;
  const failedCount = recentSessions.length - passedCount;
  const passRateNum = recentSessions.length > 0 ? Math.round((passedCount / recentSessions.length) * 100) : 85;
  const passRateStr = `${passRateNum}%`;

  // Auditor metrics
  const totalAuditCompliant = recentAudits.filter((a) => a.is_compliant).length;
  const totalAuditNonCompliant = recentAudits.length - totalAuditCompliant;
  const auditComplianceNum = recentAudits.length > 0 ? Math.round((totalAuditCompliant / recentAudits.length) * 100) : 92;
  const auditComplianceStr = `${auditComplianceNum}%`;

  // Manager combined metrics
  const totalActivities = recentAudits.length + recentSessions.length;
  const avgAuditScore =
    recentAudits.length > 0
      ? Math.round(recentAudits.reduce((acc, curr) => acc + (curr.compliance_score || 85), 0) / recentAudits.length)
      : 90;
  const avgTrainingScore =
    recentSessions.length > 0
      ? Math.round(
          recentSessions.reduce(
            (acc, curr) => acc + (curr.percentage || curr.total_score || 85),
            0
          ) / recentSessions.length
        )
      : 88;

  // Grade distributions
  const gradeSB = recentSessions.filter((s) => (s.grade || 'B') === 'SB').length;
  const gradeB = recentSessions.filter((s) => (s.grade || 'B') === 'B').length;
  const gradeC = recentSessions.filter((s) => (s.grade || 'B') === 'C').length;
  const gradeK = recentSessions.filter((s) => (s.grade || 'B') === 'K').length;

  // Total findings count
  const totalFindingsCount = recentAudits.reduce((acc, curr) => acc + (curr.findings?.length || curr.nok_items || 0), 0);

  // Fallback outlets for quick modal
  const defaultFallbackOutlets = [
    { id: '1', name: 'Outlet Senayan City', division: 'Jakarta Selatan' },
    { id: '2', name: 'Outlet Central Park', division: 'Jakarta Barat' },
    { id: '3', name: 'Outlet Grand Indonesia', division: 'Jakarta Pusat' },
    { id: '4', name: 'Outlet BSD City', division: 'Tangerang Selatan' },
    { id: '5', name: 'Outlet Kelapa Gading', division: 'Jakarta Utara' },
  ];
  const availableOutlets = rawOutlets.length > 0 ? rawOutlets : defaultFallbackOutlets;
  const filteredOutletsForBackup = availableOutlets.filter((o) =>
    o.name.toLowerCase().includes(outletSearchQuery.toLowerCase()) ||
    (o.division && o.division.toLowerCase().includes(outletSearchQuery.toLowerCase()))
  );

  // Combined activity feed
  const combinedActivities = useMemo(() => {
    const audits = recentAudits.map((a) => ({
      ...a,
      _type: 'audit' as const,
      _date: a.inspection_date ? new Date(a.inspection_date).getTime() : 0,
    }));
    const sessions = recentSessions.map((s) => ({
      ...s,
      _type: 'training' as const,
      _date: s.training_date ? new Date(s.training_date).getTime() : 0,
    }));

    let all = [...audits, ...sessions].sort((a, b) => b._date - a._date);

    if (managerFeedFilter === 'audit') {
      all = all.filter((x) => x._type === 'audit');
    } else if (managerFeedFilter === 'training') {
      all = all.filter((x) => x._type === 'training');
    }

    return all;
  }, [recentAudits, recentSessions, managerFeedFilter]);

  const handleStartBackup = (actionType: 'audit' | 'training') => {
    setBackupActionType(actionType);
    setOutletSearchQuery('');
    setIsBackupPickerOpen(true);
  };

  const handleSelectOutletForBackup = (outlet: any) => {
    setSelectedOutletForBackup(outlet);
    setIsBackupPickerOpen(false);

    if (backupActionType === 'audit') {
      setIsAuditSheetOpen(true);
    } else if (backupActionType === 'training') {
      setIsTrainingSheetOpen(true);
    }
  };

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
          title={`Halo, ${firstName}`}
          subtitle={isManager ? 'HRBP & Training Manager' : isTrainer ? 'Trainer & Asesor TnD' : 'Auditor Lapangan'}
          overlap
          right={
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <TouchableOpacity
                onPress={() => Alert.alert('Notifikasi', 'Tidak ada notifikasi mendesak.')}
                accessibilityRole="button"
                accessibilityLabel="Notifikasi"
                activeOpacity={0.7}
                style={{ width: TOUCH_MIN, height: TOUCH_MIN, alignItems: 'center', justifyContent: 'center' }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: 'rgba(255,255,255,0.14)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MaterialIcons name="notifications-none" size={21} color={COLORS.onBrand} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/(tabs)/profile')}
                accessibilityRole="button"
                accessibilityLabel="Buka profil"
                activeOpacity={0.7}
                style={{ width: TOUCH_MIN, height: TOUCH_MIN, alignItems: 'center', justifyContent: 'center' }}
              >
                <Avatar name={user?.name || firstName} size={42} />
              </TouchableOpacity>
            </View>
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
            {isManager ? (
              <>
                <HeaderStat value={totalActivities} label="Total Sesi" loading={isLoading} />
                <View style={{ width: 1, height: 34, backgroundColor: 'rgba(255,255,255,0.18)' }} />
                <HeaderStat value={auditComplianceStr} label="Kepatuhan" loading={isLoading} />
                <View style={{ width: 1, height: 34, backgroundColor: 'rgba(255,255,255,0.18)' }} />
                <HeaderStat value={passRateStr} label="Kelulusan" loading={isLoading} />
              </>
            ) : (
              <>
                <HeaderStat
                  value={isTrainer ? recentSessions.length : recentAudits.length}
                  label={isTrainer ? 'Sesi In-House' : 'Audit Selesai'}
                  loading={isLoading}
                />
                <View style={{ width: 1, height: 34, backgroundColor: 'rgba(255,255,255,0.18)' }} />
                <HeaderStat
                  value={isTrainer ? passRateStr : auditComplianceStr}
                  label={isTrainer ? 'Kelulusan' : 'Kepatuhan'}
                  loading={isLoading}
                />
                <View style={{ width: 1, height: 34, backgroundColor: 'rgba(255,255,255,0.18)' }} />
                <HeaderStat value={outletCount || '—'} label="Outlet Aktif" loading={isLoading} />
              </>
            )}
          </View>
        </BrandHeader>

        <View style={{ paddingHorizontal: 20 }}>
          {/* ================= DIRECT ON-DEMAND ACTION MENU (JADWAL BEBAS) ================= */}
          <View style={{ marginTop: -26, ...SHADOW.raised }}>
            <Card style={{ padding: 18 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <MaterialIcons name="bolt" size={19} color={COLORS.primary} />
                  <Text style={{ ...TYPE.h3, fontSize: 15, color: COLORS.textMain, fontWeight: '800' }}>
                    Mulai Aktivitas Baru
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: COLORS.surfaceSunken,
                    paddingHorizontal: 9,
                    paddingVertical: 3.5,
                    borderRadius: RADIUS.pill,
                  }}
                >
                  <Text style={{ ...TYPE.micro, color: COLORS.textSecondary, fontWeight: '800' }}>JADWAL BEBAS</Text>
                </View>
              </View>

              <Text style={{ ...TYPE.label, color: COLORS.textSecondary, marginBottom: 14, lineHeight: 18 }}>
                {isTrainer
                  ? 'Mulai evaluasi standar operasional & kompetensi barista gerai secara on-demand:'
                  : !isManager
                  ? 'Mulai inspeksi kepatuhan checklist gerai & bukti foto temuan secara on-demand:'
                  : 'Pilih menu supervisi di bawah ini untuk memulai evaluasi atau inspeksi on-demand:'}
              </Text>

              {/* Action Cards with Strict RBAC */}
              <View style={{ gap: 11 }}>
                {/* 1. Mulai In-House Training (Hanya Trainer & Manager) */}
                {(isTrainer || isManager) && (
                  <TouchableOpacity
                    onPress={() => handleStartActivity('training')}
                    activeOpacity={0.88}
                    style={{
                      backgroundColor: COLORS.primaryLight,
                      borderRadius: RADIUS.md,
                      padding: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderWidth: 1.5,
                      borderColor: COLORS.primary,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 22,
                          backgroundColor: COLORS.primary,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <MaterialIcons name="school" size={24} color="#FFFFFF" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14.5, fontWeight: '800', color: COLORS.primary }}>
                          Mulai In-House Training
                        </Text>
                        <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>
                          Asesmen kompetensi staf & barista gerai
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                        backgroundColor: COLORS.primary,
                        paddingHorizontal: 12,
                        paddingVertical: 6.5,
                        borderRadius: RADIUS.pill,
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFFFFF' }}>Pilih Gerai</Text>
                      <MaterialIcons name="arrow-forward" size={14} color="#FFFFFF" />
                    </View>
                  </TouchableOpacity>
                )}

                {/* 2. Mulai Audit Lapangan (Hanya Auditor & Manager) */}
                {(!isTrainer || isManager) && (
                  <TouchableOpacity
                    onPress={() => handleStartActivity('audit')}
                    activeOpacity={0.88}
                    style={{
                      backgroundColor: COLORS.successLight,
                      borderRadius: RADIUS.md,
                      padding: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderWidth: 1.5,
                      borderColor: COLORS.success,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 22,
                          backgroundColor: COLORS.success,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <MaterialIcons name="fact-check" size={24} color="#FFFFFF" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14.5, fontWeight: '800', color: COLORS.success }}>
                          Mulai Audit Lapangan
                        </Text>
                        <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>
                          Inspeksi kepatuhan gerai (OK/NOK & temuan)
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                        backgroundColor: COLORS.success,
                        paddingHorizontal: 12,
                        paddingVertical: 6.5,
                        borderRadius: RADIUS.pill,
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFFFFF' }}>Pilih Gerai</Text>
                      <MaterialIcons name="arrow-forward" size={14} color="#FFFFFF" />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </Card>
          </View>

          {loadError && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                backgroundColor: COLORS.dangerLight,
                borderRadius: RADIUS.md,
                padding: 14,
                marginTop: 16,
              }}
            >
              <MaterialIcons name="cloud-off" size={20} color={COLORS.danger} />
              <Text style={{ flex: 1, ...TYPE.label, color: COLORS.danger }}>
                Gagal memuat data terbaru. Tarik ke bawah untuk memuat ulang.
              </Text>
              <TouchableOpacity onPress={onRefresh} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                <MaterialIcons name="refresh" size={22} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          )}

          {/* ================= MANAGER MINIMALIST CHARTS ================= */}
          {isManager && (
            <>
              <Text style={{ ...TYPE.h3, color: COLORS.textMain, marginTop: 24, marginBottom: 10 }}>
                Ringkasan Kinerja
              </Text>

              {/* Card 1: Dual Progress Bar (Audit & Training) */}
              <Card style={{ padding: 16, marginBottom: 12 }}>
                {/* Audit Bar */}
                <View style={{ marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.textMain }}>
                      Audit Gerai
                    </Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.success }}>
                      {auditComplianceStr} ({totalAuditCompliant} OK / {recentAudits.length || 0})
                    </Text>
                  </View>
                  <View style={{ height: 8, backgroundColor: COLORS.surfaceSunken, borderRadius: 4, overflow: 'hidden' }}>
                    <View style={{ width: `${auditComplianceNum}%`, height: '100%', backgroundColor: COLORS.success, borderRadius: 4 }} />
                  </View>
                </View>

                {/* Training Bar */}
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.textMain }}>
                      Training Staf
                    </Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.primary }}>
                      {passRateStr} ({passedCount} Lulus / {recentSessions.length || 0})
                    </Text>
                  </View>
                  <View style={{ height: 8, backgroundColor: COLORS.surfaceSunken, borderRadius: 4, overflow: 'hidden' }}>
                    <View style={{ width: `${passRateNum}%`, height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 }} />
                  </View>
                </View>
              </Card>

              {/* Card 2: Grade Breakdown (4 Mini Badges) */}
              <Card style={{ padding: 14, marginBottom: 12 }}>
                <Text style={{ ...TYPE.micro, color: COLORS.textMuted, marginBottom: 10 }}>
                  DISTRIBUSI NILAI TRAINING
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {[
                    { grade: 'SB', count: gradeSB, color: GRADE_COLOR.SB, label: '≥90%' },
                    { grade: 'B', count: gradeB, color: GRADE_COLOR.B, label: '75-89%' },
                    { grade: 'C', count: gradeC, color: GRADE_COLOR.C, label: '60-74%' },
                    { grade: 'K', count: gradeK, color: GRADE_COLOR.K, label: '<60%' },
                  ].map((item) => (
                    <View
                      key={item.grade}
                      style={{
                        flex: 1,
                        backgroundColor: COLORS.surfaceSunken,
                        borderRadius: RADIUS.sm,
                        paddingVertical: 8,
                        alignItems: 'center',
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color }} />
                        <Text style={{ fontSize: 12, fontWeight: '800', color: COLORS.textMain }}>{item.grade}</Text>
                      </View>
                      <Text style={{ fontSize: 16, fontWeight: '800', color: item.color, marginTop: 2 }}>
                        {item.count}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>

              {/* 4 Clean Metric Tiles */}
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Card style={{ flex: 1, padding: 12 }}>
                  <Text style={{ ...TYPE.micro, fontSize: 10, color: COLORS.textMuted }}>SKOR AUDIT</Text>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.success, marginTop: 2 }}>
                    {avgAuditScore}%
                  </Text>
                </Card>
                <Card style={{ flex: 1, padding: 12 }}>
                  <Text style={{ ...TYPE.micro, fontSize: 10, color: COLORS.textMuted }}>SKOR TRAINING</Text>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.primary, marginTop: 2 }}>
                    {avgTrainingScore}%
                  </Text>
                </Card>
                <Card style={{ flex: 1, padding: 12 }}>
                  <Text style={{ ...TYPE.micro, fontSize: 10, color: COLORS.textMuted }}>TEMUAN NOK</Text>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.danger, marginTop: 2 }}>
                    {totalFindingsCount}
                  </Text>
                </Card>
                <Card style={{ flex: 1, padding: 12 }}>
                  <Text style={{ ...TYPE.micro, fontSize: 10, color: COLORS.textMuted }}>TOTAL GERAI</Text>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.brandDeep, marginTop: 2 }}>
                    {outletCount || 5}
                  </Text>
                </Card>
              </View>
            </>
          )}

          {/* ================= RECENT HISTORY / COMBINED FEED ================= */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 10 }}>
            <Text style={{ ...TYPE.h3, color: COLORS.textMain }}>
              {isManager
                ? 'Aktivitas Terbaru'
                : isTrainer
                ? 'Evaluasi Training Terbaru'
                : 'Riwayat Audit Kepatuhan'}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/outlets')}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}
            >
              <Text style={{ ...TYPE.label, color: COLORS.primary }}>Lihat Semua</Text>
              <MaterialIcons name="chevron-right" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Segmented Filter for Manager Feed */}
          {isManager && (
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
              {[
                { key: 'all', label: 'Semua' },
                { key: 'audit', label: 'Audit' },
                { key: 'training', label: 'Training' },
              ].map((tab) => {
                const active = managerFeedFilter === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    onPress={() => setManagerFeedFilter(tab.key as any)}
                    activeOpacity={0.7}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: RADIUS.pill,
                      backgroundColor: active ? COLORS.brandDeep : COLORS.surfaceSunken,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: active ? COLORS.onBrand : COLORS.textSecondary,
                      }}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* MANAGER VIEW: Combined Audit + Training Feed */}
          {isManager ? (
            <Card padded={false} style={{ overflow: 'hidden' }}>
              {isLoading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow last />
                </>
              ) : combinedActivities.length === 0 ? (
                <View style={{ paddingVertical: 36, paddingHorizontal: 24, alignItems: 'center' }}>
                  <MaterialIcons name="assignment" size={28} color={COLORS.textMuted} />
                  <Text style={{ ...TYPE.h3, color: COLORS.textMain, marginTop: 10 }}>Belum ada aktivitas</Text>
                </View>
              ) : (
                combinedActivities.slice(0, 7).map((item, idx) => {
                  const isAudit = item._type === 'audit';
                  const outletName =
                    item.outlet_name ||
                    item.outlet?.name ||
                    outletsMap[item.outlet_id] ||
                    'Outlet Cabang';
                  const dateStr = item.inspection_date || item.training_date
                    ? new Date(item.inspection_date || item.training_date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                      })
                    : 'Hari Ini';

                  if (isAudit) {
                    const isCompliant = item.is_compliant;
                    const score = item.compliance_score || 85;
                    const okCount = item.ok_items ?? (item.total_items ? item.total_items - (item.nok_items || 0) : 18);
                    const nokCount = item.nok_items ?? (item.findings?.length || 0);

                    return (
                      <TouchableOpacity
                        key={`aud-${item.id || idx}`}
                        activeOpacity={0.7}
                        onPress={() => {
                          const findingText =
                            item.findings && item.findings.length > 0
                              ? `\n\nTemuan (${item.findings.length}):\n` +
                                item.findings
                                  .map(
                                    (f: any, i: number) =>
                                      `${i + 1}. ${f.point_text || f.question}`
                                  )
                                  .join('\n')
                              : '\n\nSemua poin checklist terpenuhi.';

                          Alert.alert(
                            outletName,
                            `• Auditor: ${item.auditor_name || 'Auditor'}\n` +
                              `• Tanggal: ${dateStr}\n` +
                              `• Skor: ${score}%\n` +
                              `• Hasil: ${okCount} OK • ${nokCount} NOK` +
                              findingText,
                            [
                              { text: 'Tutup', style: 'cancel' },
                              { text: 'Buka Outlet', onPress: () => router.push('/(tabs)/outlets') },
                            ]
                          );
                        }}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 12,
                          minHeight: 68,
                          paddingVertical: 10,
                          paddingHorizontal: 16,
                          borderBottomWidth: idx < Math.min(combinedActivities.length, 7) - 1 ? 1 : 0,
                          borderBottomColor: COLORS.divider,
                        }}
                      >
                        <View
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: RADIUS.sm,
                            backgroundColor: isCompliant ? COLORS.successLight : COLORS.dangerLight,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <MaterialIcons
                            name={isCompliant ? 'fact-check' : 'warning'}
                            size={20}
                            color={isCompliant ? COLORS.success : COLORS.danger}
                          />
                        </View>

                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={{ ...TYPE.h3, fontSize: 14, color: COLORS.textMain }} numberOfLines={1}>
                              {outletName}
                            </Text>
                            <View
                              style={{
                                backgroundColor: COLORS.surfaceSunken,
                                paddingHorizontal: 5,
                                paddingVertical: 1,
                                borderRadius: RADIUS.pill,
                              }}
                            >
                              <Text style={{ fontSize: 9.5, fontWeight: '700', color: COLORS.brandDark }}>AUDIT</Text>
                            </View>
                          </View>
                          <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }} numberOfLines={1}>
                            {okCount} OK • {nokCount} NOK • {dateStr}
                          </Text>
                        </View>

                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.textMain }}>
                            {score}%
                          </Text>
                          <Text
                            style={{
                              fontSize: 10.5,
                              fontWeight: '700',
                              color: isCompliant ? COLORS.success : COLORS.danger,
                            }}
                          >
                            {isCompliant ? 'OK' : 'NOK'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  } else {
                    const isPassed = item.is_passed;
                    const grade = item.grade || 'B';
                    const score = item.percentage ? Math.round(item.percentage) : item.total_score || 85;

                    return (
                      <TouchableOpacity
                        key={`trn-${item.id || idx}`}
                        activeOpacity={0.7}
                        onPress={() =>
                          Alert.alert(
                            outletName,
                            `• Peserta: ${item.trainee_name || 'Tim Barista'}\n` +
                              `• Trainer: ${item.trainer_name || 'Trainer'}\n` +
                              `• Tanggal: ${dateStr}\n` +
                              `• Hasil: Grade ${grade} (${score}%)` +
                              (item.notes ? `\n\nCatatan: ${item.notes}` : ''),
                            [
                              { text: 'Tutup', style: 'cancel' },
                              { text: 'Buka Outlet', onPress: () => router.push('/(tabs)/outlets') },
                            ]
                          )
                        }
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 12,
                          minHeight: 68,
                          paddingVertical: 10,
                          paddingHorizontal: 16,
                          borderBottomWidth: idx < Math.min(combinedActivities.length, 7) - 1 ? 1 : 0,
                          borderBottomColor: COLORS.divider,
                        }}
                      >
                        <GradeBadge grade={grade} />

                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={{ ...TYPE.h3, fontSize: 14, color: COLORS.textMain }} numberOfLines={1}>
                              {outletName}
                            </Text>
                            <View
                              style={{
                                backgroundColor: COLORS.primaryLight,
                                paddingHorizontal: 5,
                                paddingVertical: 1,
                                borderRadius: RADIUS.pill,
                              }}
                            >
                              <Text style={{ fontSize: 9.5, fontWeight: '700', color: COLORS.primary }}>TRAINING</Text>
                            </View>
                          </View>
                          <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }} numberOfLines={1}>
                            Grade {grade} • {dateStr}
                          </Text>
                        </View>

                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.textMain }}>
                            {score}%
                          </Text>
                          <Text
                            style={{
                              fontSize: 10.5,
                              fontWeight: '700',
                              color: isPassed ? COLORS.success : COLORS.danger,
                            }}
                          >
                            {isPassed ? 'LULUS' : 'RETRAIN'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }
                })
              )}
            </Card>
          ) : isTrainer ? (
            /* TRAINER ONLY VIEW */
            <Card padded={false} style={{ overflow: 'hidden' }}>
              {isLoading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow last />
                </>
              ) : recentSessions.length === 0 ? (
                <View style={{ paddingVertical: 36, paddingHorizontal: 24, alignItems: 'center' }}>
                  <MaterialIcons name="event-available" size={28} color={COLORS.textMuted} />
                  <Text style={{ ...TYPE.h3, color: COLORS.textMain, marginTop: 14 }}>Belum ada riwayat training</Text>
                </View>
              ) : (
                recentSessions.slice(0, 5).map((session, idx) => {
                  const outletName = session.outlet?.name || outletsMap[session.outlet_id] || 'Outlet Cabang';
                  const dateStr = session.training_date
                    ? new Date(session.training_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                    : 'Hari Ini';
                  const isPassed = session.is_passed;
                  const grade = session.grade || 'B';
                  const score = session.percentage ? Math.round(session.percentage) : session.total_score || 85;

                  return (
                    <TouchableOpacity
                      key={session.id || idx}
                      activeOpacity={0.7}
                      onPress={() =>
                        Alert.alert(
                          outletName,
                          `• Peserta: ${session.trainee_name || 'Tim Barista'}\n` +
                            `• Tanggal: ${dateStr}\n` +
                            `• Grade: ${grade} (${score}%)`,
                          [
                            { text: 'Tutup', style: 'cancel' },
                            { text: 'Buka Outlet', onPress: () => router.push('/(tabs)/outlets') },
                          ]
                        )
                      }
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                        minHeight: 68,
                        paddingVertical: 10,
                        paddingHorizontal: 16,
                        borderBottomWidth: idx < Math.min(recentSessions.length, 5) - 1 ? 1 : 0,
                        borderBottomColor: COLORS.divider,
                      }}
                    >
                      <GradeBadge grade={grade} />

                      <View style={{ flex: 1 }}>
                        <Text style={{ ...TYPE.h3, fontSize: 14, color: COLORS.textMain }} numberOfLines={1}>
                          {outletName}
                        </Text>
                        <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }} numberOfLines={1}>
                          {session.trainee_name ? `${session.trainee_name} • ` : ''}
                          {dateStr}
                        </Text>
                      </View>

                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.textMain }}>
                          {score}%
                        </Text>
                        <Text
                          style={{
                            fontSize: 10.5,
                            fontWeight: '700',
                            color: isPassed ? COLORS.success : COLORS.danger,
                          }}
                        >
                          {isPassed ? 'LULUS' : 'RETRAIN'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </Card>
          ) : (
            /* AUDITOR ONLY VIEW */
            <Card padded={false} style={{ overflow: 'hidden' }}>
              {isLoading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow last />
                </>
              ) : recentAudits.length === 0 ? (
                <View style={{ paddingVertical: 36, paddingHorizontal: 24, alignItems: 'center' }}>
                  <MaterialIcons name="fact-check" size={28} color={COLORS.textMuted} />
                  <Text style={{ ...TYPE.h3, color: COLORS.textMain, marginTop: 14 }}>Belum ada riwayat audit</Text>
                </View>
              ) : (
                recentAudits.slice(0, 5).map((audit, idx) => {
                  const outletName = audit.outlet_name || outletsMap[audit.outlet_id] || 'Outlet Cabang';
                  const dateStr = audit.inspection_date
                    ? new Date(audit.inspection_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                    : 'Hari Ini';
                  const isCompliant = audit.is_compliant;
                  const score = audit.compliance_score || 85;
                  const okCount = audit.ok_items ?? (audit.total_items ? audit.total_items - (audit.nok_items || 0) : 18);
                  const nokCount = audit.nok_items ?? (audit.findings?.length || 0);

                  return (
                    <TouchableOpacity
                      key={audit.id || idx}
                      activeOpacity={0.7}
                      onPress={() => {
                        Alert.alert(
                          outletName,
                          `• Auditor: ${audit.auditor_name || 'Auditor'}\n` +
                            `• Tanggal: ${dateStr}\n` +
                            `• Skor: ${score}%\n` +
                            `• ${okCount} OK • ${nokCount} NOK`,
                          [
                            { text: 'Tutup', style: 'cancel' },
                            { text: 'Buka Outlet', onPress: () => router.push('/(tabs)/outlets') },
                          ]
                        );
                      }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                        minHeight: 68,
                        paddingVertical: 10,
                        paddingHorizontal: 16,
                        borderBottomWidth: idx < Math.min(recentAudits.length, 5) - 1 ? 1 : 0,
                        borderBottomColor: COLORS.divider,
                      }}
                    >
                      <View
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: RADIUS.sm,
                          backgroundColor: isCompliant ? COLORS.successLight : COLORS.dangerLight,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <MaterialIcons
                          name={isCompliant ? 'check' : 'close'}
                          size={20}
                          color={isCompliant ? COLORS.success : COLORS.danger}
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={{ ...TYPE.h3, fontSize: 14, color: COLORS.textMain }} numberOfLines={1}>
                          {outletName}
                        </Text>
                        <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }} numberOfLines={1}>
                          {okCount} OK • {nokCount > 0 ? `${nokCount} NOK` : 'Nihil'} • {dateStr}
                        </Text>
                      </View>

                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.textMain }}>
                          {score}%
                        </Text>
                        <Text
                          style={{
                            fontSize: 10.5,
                            fontWeight: '700',
                            color: isCompliant ? COLORS.success : COLORS.danger,
                          }}
                        >
                          {isCompliant ? 'OK' : 'NOK'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </Card>
          )}
        </View>
      </ScrollView>

      {/* ================= MODAL OUTLET PICKER UNTUK BACKUP AKSI ================= */}
      <Modal
        visible={isBackupPickerOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsBackupPickerOpen(false)}
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
                  {backupActionType === 'audit' ? 'Pilih Gerai untuk Audit Lapangan' : 'Pilih Gerai untuk In-House Training'}
                </Text>
                <Text style={{ ...TYPE.micro, color: COLORS.textSecondary, marginTop: 2 }}>
                  Jadwal Bebas • Pilih gerai untuk memulai on-demand
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsBackupPickerOpen(false)}
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
                  placeholder="Cari gerai..."
                  placeholderTextColor={COLORS.textMuted}
                  style={{ flex: 1, marginLeft: 8, fontSize: 14, color: COLORS.textMain }}
                />
              </View>
            </View>

            {/* Outlet List */}
            <ScrollView style={{ paddingHorizontal: 20 }}>
              {filteredOutletsForBackup.map((outlet, idx) => (
                <TouchableOpacity
                  key={outlet.id || idx}
                  onPress={() => handleSelectOutletForBackup(outlet)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 14,
                    borderBottomWidth: idx < filteredOutletsForBackup.length - 1 ? 1 : 0,
                    borderBottomColor: COLORS.divider,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: RADIUS.sm,
                        backgroundColor: backupActionType === 'audit' ? COLORS.successLight : COLORS.primaryLight,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MaterialIcons
                        name={backupActionType === 'audit' ? 'storefront' : 'school'}
                        size={20}
                        color={backupActionType === 'audit' ? COLORS.success : COLORS.primary}
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
                      backgroundColor: backupActionType === 'audit' ? COLORS.successLight : COLORS.primaryLight,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: RADIUS.pill,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: backupActionType === 'audit' ? COLORS.success : COLORS.primary,
                      }}
                    >
                      Mulai
                    </Text>
                    <MaterialIcons
                      name="arrow-forward"
                      size={14}
                      color={backupActionType === 'audit' ? COLORS.success : COLORS.primary}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ================= BOTTOM SHEETS UNTUK EKSEKUSI ON-DEMAND ================= */}
      {selectedOutletForBackup && (
        <>
          <AuditInspectionBottomSheet
            visible={isAuditSheetOpen}
            outlet={selectedOutletForBackup}
            auditorName={user?.name || (isManager ? 'Rian (HRBP Manager)' : 'Auditor Lapangan')}
            onClose={() => setIsAuditSheetOpen(false)}
            onSuccess={() => {
              setIsAuditSheetOpen(false);
              loadData();
            }}
          />

          <InHouseAssessmentBottomSheet
            visible={isTrainingSheetOpen}
            outlet={selectedOutletForBackup}
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
