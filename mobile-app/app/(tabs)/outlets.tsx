import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { fetchOutletsApi, fetchInHouseSessionsApi, fetchAuditInspectionsApi } from '../../src/services/api';
import { InHouseAssessmentBottomSheet } from '../../src/components/training/InHouseAssessmentBottomSheet';
import { AuditInspectionBottomSheet } from '../../src/components/audit/AuditInspectionBottomSheet';
import { BrandHeader, BrandStatusScrim } from '../../src/components/ui/BrandHeader';
import { Card } from '../../src/components/ui/Card';
import { GradeBadge } from '../../src/components/ui/GradeBadge';
import { COLORS, RADIUS, SHADOW, TOUCH_MIN, TYPE, GRADE_COLOR } from '../../src/theme';

interface OutletItem {
  id: string;
  name: string;
  division: string;
  lastDate: string;
  status: string;
  grade?: 'SB' | 'B' | 'C' | 'K';
  score?: number;
  staffCount?: number;
  isCompliant?: boolean;
}

export default function OutletsScreen() {
  const { user } = useAuth();
  const isTrainer = user?.role?.toUpperCase().includes('TRAINER') || user?.email?.includes('trainer');
  const [filter, setFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [realOutlets, setRealOutlets] = useState<any[]>([]);

  // Trainer Sheet State
  const [selectedTrainerOutlet, setSelectedTrainerOutlet] = useState<OutletItem | null>(null);
  const [isTrainerAssessmentOpen, setIsTrainerAssessmentOpen] = useState(false);
  const [sessionResults, setSessionResults] = useState<Record<string, { grade: 'SB' | 'B' | 'C' | 'K'; score: number; status: string; date?: string }>>({});

  // Auditor Sheet State
  const [selectedAuditOutlet, setSelectedAuditOutlet] = useState<OutletItem | null>(null);
  const [isAuditInspectionOpen, setIsAuditInspectionOpen] = useState(false);
  const [auditResults, setAuditResults] = useState<Record<string, { score: number; status: string; isCompliant: boolean; date?: string }>>({});

  const loadData = () => {
    // 1. Fetch Outlets
    const outletsReq = fetchOutletsApi().then((data) => {
      if (data && data.length > 0) {
        setRealOutlets(data);
      }
    });

    // 2. Fetch Sessions / Inspections
    if (isTrainer) {
      const sessionsReq = fetchInHouseSessionsApi().then((sessions) => {
        if (sessions && Array.isArray(sessions) && sessions.length > 0) {
          const resultsMap: Record<string, { grade: 'SB' | 'B' | 'C' | 'K'; score: number; status: string; date?: string }> = {};
          sessions.forEach((s: any) => {
            const status = s.is_passed ? 'Lulus Sesi' : 'Perlu Re-Training';
            const grade = (s.grade || 'B') as 'SB' | 'B' | 'C' | 'K';
            const score = Math.round(s.percentage || s.total_score || 85);
            const date = s.training_date
              ? new Date(s.training_date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Selesai';

            if (s.outlet_id) resultsMap[s.outlet_id] = { grade, score, status, date };
            if (s.outlet?.name) resultsMap[s.outlet.name] = { grade, score, status, date };
            if (s.outlet_name) resultsMap[s.outlet_name] = { grade, score, status, date };
          });

          setSessionResults((prev) => ({
            ...resultsMap,
            ...prev,
          }));
        }
      });
      return Promise.all([outletsReq, sessionsReq]).catch(() => undefined);
    } else {
      const auditReq = fetchAuditInspectionsApi().then((inspections) => {
        if (inspections && Array.isArray(inspections) && inspections.length > 0) {
          const resultsMap: Record<string, { score: number; status: string; isCompliant: boolean; date?: string }> = {};
          inspections.forEach((a: any) => {
            const isCompliant = a.is_compliant;
            const status = isCompliant ? 'Compliant' : 'Non-Compliant';
            const score = a.compliance_score || 85;
            const date = a.inspection_date
              ? new Date(a.inspection_date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Selesai';

            if (a.outlet_id) resultsMap[a.outlet_id] = { score, status, isCompliant, date };
            if (a.outlet_name) resultsMap[a.outlet_name] = { score, status, isCompliant, date };
          });

          setAuditResults((prev) => ({
            ...resultsMap,
            ...prev,
          }));
        }
      });
      return Promise.all([outletsReq, auditReq]).catch(() => undefined);
    }
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [user, isTrainer]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData().finally(() => setIsRefreshing(false));
  }, [user, isTrainer]);

  // Default initial demo outlets (some pending, some evaluated)
  const defaultTrainerOutlets: OutletItem[] = [
    { id: '1', name: 'Outlet Senayan City', division: 'POS Terminal Senayan #1', lastDate: 'Belum Dinilai', status: 'Siap Training', staffCount: 6 },
    { id: '2', name: 'Outlet Central Park', division: 'POS Terminal Central Park #1', lastDate: 'Belum Dinilai', status: 'Siap Training', staffCount: 5 },
    { id: '3', name: 'Outlet Grand Indonesia', division: 'POS Terminal Grand Indonesia #1', lastDate: 'Belum Dinilai', status: 'Siap Training', staffCount: 8 },
    { id: '4', name: 'HANS-YIA', division: 'Outlet YIA', lastDate: '10 Juli 2026', status: 'Lulus Sesi', grade: 'SB', score: 96, staffCount: 6 },
    { id: '5', name: 'KINGTECH-T3E', division: 'Outlet T3E', lastDate: '8 Juli 2026', status: 'Perlu Re-Training', grade: 'C', score: 68, staffCount: 4 },
  ];

  const defaultAuditorOutlets: OutletItem[] = [
    { id: '1', name: 'Outlet Senayan City', division: 'Operasional, K3 & 5S', lastDate: 'Belum Diaudit', status: 'Siap Diaudit' },
    { id: '2', name: 'Outlet Central Park', division: 'Standar Sanitasi & Kasir', lastDate: 'Belum Diaudit', status: 'Siap Diaudit' },
    { id: '3', name: 'Outlet Grand Indonesia', division: 'Operasional & Higienitas', lastDate: 'Belum Diaudit', status: 'Siap Diaudit' },
    { id: '4', name: 'Outlet Kemang', division: 'Operasional & 5S', lastDate: '8 Juli 2026', status: 'Compliant', score: 95, isCompliant: true },
    { id: '5', name: 'Outlet Sudirman', division: 'Keselamatan & Kasir', lastDate: '5 Juli 2026', status: 'Non-Compliant', score: 70, isCompliant: false },
  ];

  const rawOutlets: OutletItem[] = realOutlets.length > 0
    ? realOutlets.map((o, idx) => ({
        id: o.id || String(idx + 1),
        name: o.name,
        division: o.device_name || (o.device_code ? `Kode: ${o.device_code}` : 'POS Terminal #1'),
        lastDate: isTrainer ? 'Belum Dinilai' : 'Belum Diaudit',
        status: isTrainer ? 'Siap Training' : 'Siap Diaudit',
        staffCount: 5 + (idx % 4),
      }))
    : (isTrainer ? defaultTrainerOutlets : defaultAuditorOutlets);

  const baseOutlets: OutletItem[] = rawOutlets.map((item) => {
    if (isTrainer) {
      const res = sessionResults[item.id] || sessionResults[item.name];
      if (res) {
        return {
          ...item,
          status: res.status,
          grade: res.grade,
          score: res.score,
          lastDate: res.date ? `${res.date} (Selesai)` : 'Hari Ini (Selesai)',
        };
      }
    } else {
      const aRes = auditResults[item.id] || auditResults[item.name];
      if (aRes) {
        return {
          ...item,
          status: aRes.status,
          score: aRes.score,
          isCompliant: aRes.isCompliant,
          lastDate: aRes.date ? `${aRes.date} (Selesai)` : 'Hari Ini (Selesai)',
        };
      }
    }
    return item;
  });

  const outlets = baseOutlets.filter((item) => {
    const matchesFilter =
      filter === 'Semua' ||
      item.status === filter ||
      (filter === 'Compliant (OK)' && item.status === 'Compliant') ||
      (filter === 'Non-Compliant (NOK)' && item.status === 'Non-Compliant');
    const matchesSearch = !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Check if an outlet has already been evaluated and must be locked
  const isOutletEvaluated = (outlet: OutletItem) => {
    if (isTrainer) {
      return (
        Boolean(sessionResults[outlet.id] || sessionResults[outlet.name]) ||
        outlet.status === 'Lulus Sesi' ||
        outlet.status === 'Perlu Re-Training'
      );
    } else {
      return (
        Boolean(auditResults[outlet.id] || auditResults[outlet.name]) ||
        outlet.status === 'Compliant' ||
        outlet.status === 'Non-Compliant'
      );
    }
  };

  const handleStartActivity = (outlet: OutletItem) => {
    const isLocked = isOutletEvaluated(outlet);

    // If already evaluated, lock and show read-only result dialog
    if (isLocked) {
      if (isTrainer) {
        Alert.alert(
          'Sesi Training Terkunci 🔒',
          `Outlet ${outlet.name} sudah selesai dinilai dan disahkan.\n\n` +
          `• Tanggal: ${outlet.lastDate}\n` +
          `• Hasil Akhir: Grade ${outlet.grade || 'B'} (${outlet.score || 85}%)\n` +
          `• Status: ${outlet.status.toUpperCase()}\n\n` +
          `Lembar penilaian ini telah ditandatangani secara digital oleh PIC Outlet dan Trainer dan tidak dapat diubah kembali untuk menjaga integritas data.`,
          [{ text: 'Tutup', style: 'default' }]
        );
      } else {
        Alert.alert(
          'Audit Lapangan Terkunci 🔒',
          `Inspeksi kepatuhan untuk ${outlet.name} sudah selesai disahkan.\n\n` +
          `• Tanggal: ${outlet.lastDate}\n` +
          `• Skor Kepatuhan: ${outlet.score}%\n` +
          `• Status: ${outlet.isCompliant ? 'COMPLIANT (OK - MEMENUHI STANDAR)' : 'NON-COMPLIANT (NOK - ADA TEMUAN)'}\n\n` +
          `Lembar inspeksi ini telah ditandatangani secara digital oleh Auditor dan Store Manager dan dikunci demi integritas data audit.`,
          [{ text: 'Tutup', style: 'default' }]
        );
      }
      return;
    }

    // Only un-evaluated outlets can open the assessment/inspection sheet
    if (isTrainer) {
      setSelectedTrainerOutlet(outlet);
      setIsTrainerAssessmentOpen(true);
    } else {
      setSelectedAuditOutlet(outlet);
      setIsAuditInspectionOpen(true);
    }
  };

  const handleTrainerSuccess = (result: {
    outletId: string;
    score: number;
    grade: 'SB' | 'B' | 'C' | 'K';
    isPassed: boolean;
    status: string;
  }) => {
    if (selectedTrainerOutlet) {
      setSessionResults((prev) => ({
        ...prev,
        [selectedTrainerOutlet.id]: {
          grade: result.grade,
          score: result.score,
          status: result.status,
        },
        [selectedTrainerOutlet.name]: {
          grade: result.grade,
          score: result.score,
          status: result.status,
        },
      }));
    }
  };

  const handleAuditSuccess = (result: {
    outletId: string;
    score: number;
    isCompliant: boolean;
    status: string;
  }) => {
    if (selectedAuditOutlet) {
      setAuditResults((prev) => ({
        ...prev,
        [selectedAuditOutlet.id]: {
          score: result.score,
          status: result.status,
          isCompliant: result.isCompliant,
        },
        [selectedAuditOutlet.name]: {
          score: result.score,
          status: result.status,
          isCompliant: result.isCompliant,
        },
      }));
    }
  };

  const trainerFilters = ['Semua', 'Siap Training', 'Lulus Sesi', 'Perlu Re-Training'];
  const auditorFilters = ['Semua', 'Siap Diaudit', 'Compliant (OK)', 'Non-Compliant (NOK)'];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <BrandStatusScrim />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
            progressViewOffset={12}
          />
        }
      >
        <BrandHeader
          title={isTrainer ? 'Pilih Outlet Training' : 'Pilih Outlet Audit'}
          subtitle={
            isTrainer
              ? 'Pilih outlet yang akan dievaluasi kompetensi standarnya on-site'
              : 'Pilih cabang yang akan diinspeksi kepatuhannya (OK / NOK)'
          }
          overlap
        />

        {/* Search */}
        <View style={{ paddingHorizontal: 20, marginTop: -26 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              backgroundColor: COLORS.surface,
              borderRadius: RADIUS.pill,
              paddingHorizontal: 18,
              minHeight: 52,
              ...SHADOW.raised,
            }}
          >
            <MaterialIcons name="search" size={21} color={COLORS.textMuted} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={isTrainer ? 'Cari nama cabang training...' : 'Cari cabang yang mau diaudit...'}
              placeholderTextColor={COLORS.textMuted}
              returnKeyType="search"
              style={{ flex: 1, fontSize: 15, color: COLORS.textMain, padding: 0 }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                accessibilityLabel="Hapus pencarian"
                hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
              >
                <MaterialIcons name="cancel" size={19} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          style={{ marginTop: 18, marginBottom: 6 }}
        >
          {(isTrainer ? trainerFilters : auditorFilters).map((f) => {
            const active = filter === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                activeOpacity={0.8}
                accessibilityState={{ selected: active }}
                style={{
                  minHeight: 40,
                  justifyContent: 'center',
                  paddingHorizontal: 16,
                  borderRadius: RADIUS.pill,
                  backgroundColor: active ? COLORS.brandDeep : COLORS.surface,
                  ...SHADOW.card,
                }}
              >
                <Text style={{ ...TYPE.label, color: active ? COLORS.onBrand : COLORS.textSecondary }}>{f}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={{ paddingHorizontal: 20, paddingTop: 10, gap: 12 }}>
          {outlets.length === 0 && (
            <Card style={{ paddingVertical: 40, alignItems: 'center' }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: COLORS.surfaceSunken,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons name="search-off" size={28} color={COLORS.textMuted} />
              </View>
              <Text style={{ ...TYPE.h3, color: COLORS.textMain, marginTop: 14 }}>Outlet tidak ditemukan</Text>
              <Text style={{ ...TYPE.body, fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', marginTop: 4 }}>
                Coba kata kunci lain atau ubah filter status.
              </Text>
              {(searchQuery.length > 0 || filter !== 'Semua') && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery('');
                    setFilter('Semua');
                  }}
                  activeOpacity={0.8}
                  style={{
                    marginTop: 16,
                    minHeight: 44,
                    justifyContent: 'center',
                    paddingHorizontal: 22,
                    borderRadius: RADIUS.pill,
                    backgroundColor: COLORS.primaryLight,
                  }}
                >
                  <Text style={{ ...TYPE.label, color: COLORS.brandDark }}>Reset Filter</Text>
                </TouchableOpacity>
              )}
            </Card>
          )}

          {outlets.map((outlet) => {
            const isLocked = isOutletEvaluated(outlet);
            const isReady = outlet.status === 'Siap Diaudit' || outlet.status === 'Siap Training';
            const isCompliant = outlet.status === 'Compliant' || (outlet.score && outlet.score >= 85);
            const isSuccess = isTrainer ? outlet.status.includes('Lulus') : isCompliant;
            const isWarning = isTrainer ? outlet.status.includes('Re-Training') : !isCompliant && !isReady;
            const statusColor = isReady ? COLORS.primary : isSuccess ? COLORS.success : isWarning ? COLORS.danger : COLORS.textSecondary;

            return (
              <TouchableOpacity
                key={outlet.id}
                onPress={() => handleStartActivity(outlet)}
                activeOpacity={0.8}
              >
                <Card padded={false} style={{ overflow: 'hidden' }}>
                  <View style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
                      {/* Left Badge: Trainer shows Grade, Auditor shows status icon */}
                      {isTrainer ? (
                        <GradeBadge grade={outlet.grade} />
                      ) : (
                        <View
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: RADIUS.md,
                            backgroundColor: isReady
                              ? COLORS.primaryLight
                              : isCompliant
                              ? COLORS.successLight
                              : COLORS.dangerLight,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: isReady
                              ? COLORS.primaryBorder
                              : isCompliant
                              ? COLORS.success
                              : COLORS.danger,
                          }}
                        >
                          <MaterialIcons
                            name={isReady ? 'pending-actions' : isCompliant ? 'check' : 'close'}
                            size={24}
                            color={isReady ? COLORS.primary : isCompliant ? COLORS.success : COLORS.danger}
                          />
                        </View>
                      )}

                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={{ ...TYPE.h3, fontSize: 15, color: COLORS.textMain, flexShrink: 1 }} numberOfLines={1}>
                            {outlet.name}
                          </Text>
                          {isLocked && <MaterialIcons name="lock" size={14} color={COLORS.textMuted} />}
                        </View>
                        <Text style={{ fontSize: 12.5, color: COLORS.textSecondary, marginTop: 3 }} numberOfLines={1}>
                          {outlet.division}
                        </Text>
                      </View>

                      {typeof outlet.score === 'number' ? (
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.textMain, letterSpacing: -0.5 }}>
                            {outlet.score}%
                          </Text>
                          {!isTrainer && (
                            <Text
                              style={{
                                ...TYPE.micro,
                                color: isCompliant ? COLORS.success : COLORS.danger,
                                marginTop: 1,
                              }}
                            >
                              {isCompliant ? 'OK (COMPLIANT)' : 'NOK (TEMUAN)'}
                            </Text>
                          )}
                        </View>
                      ) : (
                        <View
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: RADIUS.pill,
                            backgroundColor: COLORS.primaryLight,
                          }}
                        >
                          <Text style={{ ...TYPE.micro, color: COLORS.primary }}>SIAP AUDIT</Text>
                        </View>
                      )}
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 13,
                        paddingTop: 12,
                        borderTopWidth: 1,
                        borderTopColor: COLORS.divider,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: statusColor }} />
                        <Text style={{ fontSize: 12, color: COLORS.textSecondary, flex: 1 }} numberOfLines={1}>
                          {isReady
                            ? 'Belum Dinilai (Tersedia untuk Audit)'
                            : isTrainer
                            ? outlet.status
                            : isCompliant
                            ? 'Selesai (Memenuhi Standar)'
                            : 'Selesai (Terdapat Temuan)'}
                        </Text>
                      </View>

                      {isLocked ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <MaterialIcons name="lock" size={15} color={COLORS.textMuted} />
                          <Text style={{ ...TYPE.micro, color: COLORS.textMuted }}>TERKUNCI 🔒</Text>
                        </View>
                      ) : (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4,
                            backgroundColor: COLORS.brandDeep,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: RADIUS.pill,
                          }}
                        >
                          <Text style={{ ...TYPE.micro, color: COLORS.onBrand, fontWeight: '700' }}>
                            {isTrainer ? 'Mulai Nilai' : 'Mulai Audit (OK/NOK)'}
                          </Text>
                          <MaterialIcons name="chevron-right" size={15} color={COLORS.onBrand} />
                        </View>
                      )}
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Trainer: In-House Training Assessment Modal */}
      {isTrainer && (
        <InHouseAssessmentBottomSheet
          visible={isTrainerAssessmentOpen}
          outlet={selectedTrainerOutlet}
          trainerName={user?.name || 'Trainer TnD'}
          onClose={() => setIsTrainerAssessmentOpen(false)}
          onSuccess={handleTrainerSuccess}
        />
      )}

      {/* Auditor: Field Audit Inspection (OK / NOK) Modal */}
      {!isTrainer && (
        <AuditInspectionBottomSheet
          visible={isAuditInspectionOpen}
          outlet={selectedAuditOutlet}
          auditorName={user?.name || 'Auditor Lapangan'}
          onClose={() => setIsAuditInspectionOpen(false)}
          onSuccess={handleAuditSuccess}
        />
      )}
    </View>
  );
}
