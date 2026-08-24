import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { fetchOutletsApi, fetchInHouseSessionsApi } from '../../src/services/api';
import { InHouseAssessmentBottomSheet } from '../../src/components/training/InHouseAssessmentBottomSheet';
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
}

export default function OutletsScreen() {
  const { user } = useAuth();
  const isTrainer = user?.role?.toUpperCase().includes('TRAINER') || user?.email?.includes('trainer');
  const [filter, setFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [realOutlets, setRealOutlets] = useState<any[]>([]);

  // In-House Assessment Sheet State
  const [selectedOutlet, setSelectedOutlet] = useState<OutletItem | null>(null);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [sessionResults, setSessionResults] = useState<Record<string, { grade: 'SB' | 'B' | 'C' | 'K'; score: number; status: string; date?: string }>>({});

  // Returns a promise so pull-to-refresh knows when to stop spinning.
  const loadData = () => {
    // 1. Fetch Outlets
    const outletsReq = fetchOutletsApi().then((data) => {
      if (data && data.length > 0) {
        setRealOutlets(data);
      }
    });

    // 2. Fetch Sessions from Backend DB to keep locked state after relogin
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

          if (s.outlet_id) {
            resultsMap[s.outlet_id] = { grade, score, status, date };
          }
          if (s.outlet?.name) {
            resultsMap[s.outlet.name] = { grade, score, status, date };
          }
          if (s.outlet_name) {
            resultsMap[s.outlet_name] = { grade, score, status, date };
          }
        });

        setSessionResults((prev) => ({
          ...resultsMap,
          ...prev,
        }));
      }
    });

    return Promise.all([outletsReq, sessionsReq]).catch(() => undefined);
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData().finally(() => setIsRefreshing(false));
  }, [user]);

  const defaultTrainerOutlets: OutletItem[] = [
    { id: '1', name: 'HANS-YIA', division: 'Outlet YIA', lastDate: 'Database Terkini', status: 'Siap Training', grade: 'SB', score: 96, staffCount: 6 },
    { id: '2', name: 'KINGTECH-T3E', division: 'Outlet T3E', lastDate: 'Database Terkini', status: 'Siap Training', grade: 'B', score: 84, staffCount: 4 },
    { id: '3', name: 'Outlet Central Park', division: 'POS Terminal Central Park #1', lastDate: 'Database Terkini', status: 'Siap Training', grade: 'SB', score: 92, staffCount: 5 },
    { id: '4', name: 'Outlet Grand Indonesia', division: 'POS Terminal Grand Indonesia #1', lastDate: 'Database Terkini', status: 'Siap Training', grade: 'B', score: 88, staffCount: 8 },
    { id: '5', name: 'Outlet Kemang Raya', division: 'POS Terminal Kemang Raya #1', lastDate: 'Database Terkini', status: 'Siap Training', grade: 'C', score: 70, staffCount: 6 },
  ];

  const defaultAuditorOutlets: OutletItem[] = [
    { id: '1', name: 'Outlet Kemang', division: 'Operasional & 5S', lastDate: '8 Juli 2026', status: 'Compliant', score: 95 },
    { id: '2', name: 'Outlet Sudirman', division: 'Keselamatan & Kasir', lastDate: '5 Juli 2026', status: 'Non-Compliant', score: 64 },
    { id: '3', name: 'Outlet Kelapa Gading', division: 'Standar Sanitasi', lastDate: '3 Juli 2026', status: 'Compliant', score: 92 },
    { id: '4', name: 'Outlet BSD City', division: 'Operasional Gudang', lastDate: '1 Juli 2026', status: 'Compliant', score: 88 },
    { id: '5', name: 'Outlet Tangerang', division: 'Peralatan & POS', lastDate: '28 Juni 2026', status: 'Non-Compliant', score: 70 },
  ];

  const baseOutlets: OutletItem[] = (realOutlets.length > 0
    ? realOutlets.map((o, idx) => ({
        id: o.id || String(idx + 1),
        name: o.name,
        division: o.device_name || (o.device_code ? `Kode: ${o.device_code}` : 'POS Terminal #1'),
        lastDate: 'Database Terkini',
        status: o.status === 'active' ? (isTrainer ? 'Siap Training' : 'Compliant') : 'Non-Compliant',
        grade: (['SB', 'B', 'SB', 'B', 'C', 'SB'][idx % 6]) as any,
        score: 85 + (idx % 12),
        staffCount: 5 + (idx % 4),
      }))
    : (isTrainer ? defaultTrainerOutlets : defaultAuditorOutlets)
  ).map((item) => {
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
    return item;
  });

  const outlets = baseOutlets.filter((item) => {
    const matchesFilter = filter === 'Semua' || item.status === filter;
    const matchesSearch = !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const isOutletEvaluated = (outlet: OutletItem) => {
    return (
      Boolean(sessionResults[outlet.id] || sessionResults[outlet.name]) ||
      outlet.status === 'Lulus Sesi' ||
      outlet.status === 'Perlu Re-Training'
    );
  };

  const handleStartActivity = (outlet: OutletItem) => {
    if (isTrainer) {
      const isLocked = isOutletEvaluated(outlet);
      if (isLocked) {
        Alert.alert(
          'Sesi Training Terkunci 🔒',
          `Outlet ${outlet.name} sudah selesai dinilai dan disahkan.\n\n` +
          `• Tanggal: ${outlet.lastDate}\n` +
          `• Hasil Akhir: Grade ${outlet.grade || 'B'} (${outlet.score || 85}%)\n` +
          `• Status: ${outlet.status.toUpperCase()}\n\n` +
          `Data penilaian ini sudah ditandatangani digital oleh PIC Outlet dan Trainer, sehingga tidak dapat dinilai ulang.`,
          [{ text: 'Tutup', style: 'default' }]
        );
        return;
      }

      Alert.alert(
        'Konfirmasi Mulai Penilaian',
        `Apakah Anda ingin memulai lembar evaluasi in-house training on-site (SB/B/C/K) untuk ${outlet.name}?`,
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Mulai Penilaian',
            onPress: () => {
              setSelectedOutlet(outlet);
              setIsAssessmentOpen(true);
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Mulai Audit Lapangan',
        `Mulai inspeksi kepatuhan untuk ${outlet.name}?`,
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Mulai Inspeksi', onPress: () => Alert.alert('Audit Dimulai', 'Form audit kepatuhan dibuka.') },
        ]
      );
    }
  };

  const handleAssessmentSuccess = (result: {
    outletId: string;
    score: number;
    grade: 'SB' | 'B' | 'C' | 'K';
    isPassed: boolean;
    status: string;
  }) => {
    if (selectedOutlet) {
      setSessionResults((prev) => ({
        ...prev,
        [selectedOutlet.id]: {
          grade: result.grade,
          score: result.score,
          status: result.status,
        },
        [selectedOutlet.name]: {
          grade: result.grade,
          score: result.score,
          status: result.status,
        },
      }));
    }
  };

  const trainerFilters = ['Semua', 'Jadwal Hari Ini', 'Lulus Sesi', 'Perlu Re-Training'];
  const auditorFilters = ['Semua', 'Compliant', 'Non-Compliant'];

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
        title={isTrainer ? 'Kunjungan In-House' : 'Outlet Audit'}
        subtitle={
          isTrainer
            ? `${outlets.length} outlet siap dievaluasi on-site (SB/B/C/K)`
            : `${outlets.length} outlet dalam cakupan inspeksi`
        }
        overlap
      />

        {/* Search floats over the header curve. */}
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
              placeholder={isTrainer ? 'Cari nama cabang...' : 'Cari outlet atau area...'}
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
            const isLocked = isTrainer && isOutletEvaluated(outlet);
            const isSuccess = outlet.status.includes('Lulus') || outlet.status === 'Compliant';
            const isWarning = outlet.status.includes('Re-Training') || outlet.status === 'Non-Compliant';
            const statusColor = isSuccess ? COLORS.success : isWarning ? COLORS.danger : COLORS.textSecondary;

            return (
              <TouchableOpacity key={outlet.id} onPress={() => handleStartActivity(outlet)} activeOpacity={0.8}>
                <Card padded={false} style={{ overflow: 'hidden' }}>

                  <View style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
                      <GradeBadge grade={isTrainer ? outlet.grade : undefined} />

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

                      {typeof outlet.score === 'number' && (
                        <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.textMain, letterSpacing: -0.5 }}>
                          {outlet.score}%
                        </Text>
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
                          {outlet.status}
                        </Text>
                      </View>

                      {isLocked ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <MaterialIcons name="verified" size={15} color={COLORS.success} />
                          <Text style={{ ...TYPE.micro, color: COLORS.success }}>DISAHKAN</Text>
                        </View>
                      ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                          <Text style={{ ...TYPE.label, color: COLORS.primary }}>
                            {isTrainer ? 'Buka Penilaian' : 'Mulai Audit'}
                          </Text>
                          <MaterialIcons name="chevron-right" size={18} color={COLORS.primary} />
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

      {/* In-House Training Assessment BottomSheet Modal */}
      <InHouseAssessmentBottomSheet
        visible={isAssessmentOpen}
        outlet={selectedOutlet}
        trainerName={user?.name || 'Trainer TnD'}
        onClose={() => setIsAssessmentOpen(false)}
        onSuccess={handleAssessmentSuccess}
      />
    </View>
  );
}
