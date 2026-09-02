import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { fetchSopsApi } from '../../src/services/api';
import { BrandHeader } from '../../src/components/ui/BrandHeader';
import { Card } from '../../src/components/ui/Card';
import { Segmented } from '../../src/components/ui/Segmented';
import { GradeBadge } from '../../src/components/ui/GradeBadge';
import { COLORS, RADIUS, SHADOW, TYPE } from '../../src/theme';

interface SopPoint {
  id: string;
  order_num: number;
  title: string;
  description?: string;
}

interface SopItem {
  id: string;
  title: string;
  category: string;
  source_pdf?: string;
  created_at?: string;
  Points?: SopPoint[];
  _count?: { Points: number };
}

export default function FindingsScreen() {
  const { user } = useAuth();
  const isManager =
    user?.role?.toUpperCase().includes('HRBP') ||
    user?.role?.toUpperCase().includes('MANAGER') ||
    user?.email?.includes('manager');
  const isTrainer = !isManager && (user?.role?.toUpperCase().includes('TRAINER') || user?.email?.includes('trainer'));
  
  // Manager Tab
  const [managerTab, setManagerTab] = useState<'findings' | 'sop'>('findings');
  // Auditor Tabs
  const [auditTab, setAuditTab] = useState<'open' | 'recurring'>('open');
  // Trainer Tabs
  const [trainerTab, setTrainerTab] = useState<'modules' | 'rubric'>('modules');

  // Real SOP Data from DB
  const [sops, setSops] = useState<SopItem[]>([]);
  const [loadingSops, setLoadingSops] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSopModal, setActiveSopModal] = useState<SopItem | null>(null);

  const loadSops = async () => {
    setLoadingSops(true);
    try {
      const data = await fetchSopsApi();
      setSops(data);
    } catch (e) {
      console.warn('Failed to load SOPs:', e);
    } finally {
      setLoadingSops(false);
    }
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadSops();
  }, []);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      setSops(await fetchSopsApi());
    } catch {
      // keep the previously loaded list on failure
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const filteredSops = sops.filter((s) => {
    const matchesCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || s.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const RUBRIC = [
    {
      grade: 'SB',
      title: 'Sangat Baik',
      score: 'Skor 5',
      headline: 'Memenuhi 100% SOP + proaktif',
      body: 'Staf melakukan langkah kerja dengan sempurna, konsisten, cepat, dan menunjukkan inisiatif pelayanan terbaik tanpa perlu supervisi.',
    },
    {
      grade: 'B',
      title: 'Baik',
      score: 'Skor 4',
      headline: 'Sesuai standar SOP minimum',
      body: 'Staf menjalankan instruksi kerja dengan tepat dan benar, namun sesekali membutuhkan panduan minor pada situasi sibuk.',
    },
    {
      grade: 'C',
      title: 'Cukup',
      score: 'Skor 3',
      headline: 'Butuh pengawasan berkala',
      body: 'Terdapat beberapa kelalaian kecil dalam urutan kerja atau kebersihan workstation, perlu supervisi berkala dari Store Manager.',
    },
    {
      grade: 'K',
      title: 'Kurang',
      score: 'Skor 1 - 2',
      headline: 'Wajib re-training',
      body: 'Tidak memenuhi standar higienitas/SOP, berpotensi menurunkan kualitas rasa atau kepuasan pelanggan. Wajib dijadwalkan training ulang.',
    },
  ];

  const OPEN_FINDINGS = [
    { title: 'Alat pemadam kebakaran (APAR) kedaluwarsa', outlet: 'Outlet Sudirman', category: 'K3 & Keselamatan', date: '7 Juli 2026', isRecurring: false },
    { title: 'SOP tidak dipasang di area kasir & kitchen', outlet: 'Outlet Tangerang', category: 'Operasional', date: '6 Juli 2026', isRecurring: true },
    { title: 'Suhu chiller penyimpanan di luar batas toleransi', outlet: 'Outlet Kemang', category: 'Quality Assurance', date: '5 Juli 2026', isRecurring: false },
    { title: 'Dokumen izin sanitasi belum diperbarui', outlet: 'Outlet BSD City', category: 'Legalitas', date: '4 Juli 2026', isRecurring: false },
    { title: 'Pekerja tidak menggunakan celemek & hairnet', outlet: 'Outlet Kelapa Gading', category: 'Higienitas', date: '3 Juli 2026', isRecurring: true },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <BrandHeader
        title={isTrainer ? 'Pustaka SOP' : 'Temuan Audit'}
        subtitle={
          isTrainer
            ? 'Standar kerja resmi yang diunggah dari Web Admin'
            : 'Ketidaksesuaian hasil inspeksi lapangan'
        }
        right={
          isTrainer ? (
            <TouchableOpacity
              onPress={loadSops}
              accessibilityLabel="Muat ulang daftar SOP"
              activeOpacity={0.7}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: 'rgba(255,255,255,0.14)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialIcons name="refresh" size={21} color={COLORS.onBrand} />
            </TouchableOpacity>
          ) : undefined
        }
      >
        <View style={{ marginTop: 20 }}>
          {isManager ? (
            <Segmented
              onBrand
              value={managerTab}
              onChange={setManagerTab}
              options={[
                { value: 'findings', label: 'Temuan Audit (8)' },
                { value: 'sop', label: `Pustaka SOP (${sops.length})` },
              ]}
            />
          ) : isTrainer ? (
            <Segmented
              onBrand
              value={trainerTab}
              onChange={setTrainerTab}
              options={[
                { value: 'modules', label: `Dokumen (${sops.length})` },
                { value: 'rubric', label: 'Skala SB/B/C/K' },
              ]}
            />
          ) : (
            <Segmented
              onBrand
              value={auditTab}
              onChange={setAuditTab}
              options={[
                { value: 'open', label: 'Temuan Terbuka (5)' },
                { value: 'recurring', label: 'Berulang (3)' },
              ]}
            />
          )}
        </View>
      </BrandHeader>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {isTrainer || (isManager && managerTab === 'sop') ? (
          /* ================= TRAINER / MANAGER SOP VIEW ================= */
          trainerTab === 'modules' ? (
            <View style={{ gap: 12 }}>
              {/* Search */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  backgroundColor: COLORS.surface,
                  borderRadius: RADIUS.pill,
                  paddingHorizontal: 18,
                  minHeight: 52,
                  ...SHADOW.card,
                }}
              >
                <MaterialIcons name="search" size={21} color={COLORS.textMuted} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Cari judul SOP..."
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

              {/* Category chips */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
                {[
                  { id: 'ALL', label: 'Semua Kategori' },
                  { id: 'HEAD_OFFICE', label: 'Head Office' },
                  { id: 'OPERASIONAL', label: 'Operasional Gerai' },
                ].map((cat) => {
                  const active = selectedCategory === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setSelectedCategory(cat.id)}
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
                      <Text style={{ ...TYPE.label, color: active ? COLORS.onBrand : COLORS.textSecondary }}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {loadingSops ? (
                <View style={{ paddingVertical: 48, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                  <Text style={{ ...TYPE.body, fontSize: 13, color: COLORS.textSecondary, marginTop: 10 }}>
                    Memuat dokumen SOP...
                  </Text>
                </View>
              ) : filteredSops.length === 0 ? (
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
                    <MaterialIcons name="folder-open" size={28} color={COLORS.textMuted} />
                  </View>
                  <Text style={{ ...TYPE.h3, color: COLORS.textMain, marginTop: 14 }}>Belum ada dokumen SOP</Text>
                  <Text style={{ ...TYPE.body, fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', marginTop: 4 }}>
                    Dokumen yang diunggah di Web Admin akan muncul di sini.
                  </Text>
                </Card>
              ) : (
                filteredSops.map((sop, idx) => {
                  const pointCount = sop.Points?.length ?? sop._count?.Points ?? 0;
                  const isHO = sop.category === 'HEAD_OFFICE';

                  return (
                    <TouchableOpacity key={sop.id} onPress={() => setActiveSopModal(sop)} activeOpacity={0.8}>
                      <Card padded={false} style={{ overflow: 'hidden' }}>
                        <View style={{ paddingHorizontal: 16, paddingVertical: 15 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 13 }}>
                            <View
                              style={{
                                width: 42,
                                height: 42,
                                borderRadius: RADIUS.md,
                                backgroundColor: COLORS.surfaceSunken,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.textSecondary }}>
                                {String(idx + 1).padStart(2, '0')}
                              </Text>
                            </View>

                            <View style={{ flex: 1 }}>
                              <Text style={{ ...TYPE.h3, fontSize: 15, color: COLORS.textMain, lineHeight: 20 }}>
                                {sop.title}
                              </Text>
                              <Text style={{ ...TYPE.micro, color: COLORS.textMuted, marginTop: 5 }}>
                                {isHO ? 'HEAD OFFICE' : 'OPERASIONAL'}
                              </Text>
                            </View>
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
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <MaterialIcons name="format-list-numbered" size={15} color={COLORS.textSecondary} />
                              <Text style={{ ...TYPE.label, color: COLORS.textSecondary }}>
                                {pointCount} butir standar
                              </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                              <Text style={{ ...TYPE.label, color: COLORS.primary }}>Lihat Detail</Text>
                              <MaterialIcons name="chevron-right" size={18} color={COLORS.primary} />
                            </View>
                          </View>
                        </View>
                      </Card>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          ) : (
            /* ================= RUBRIC ================= */
            <View style={{ gap: 12 }}>
              {RUBRIC.map((r) => (
                <Card key={r.grade}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
                    <GradeBadge grade={r.grade} />
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                        <Text style={{ ...TYPE.h3, fontSize: 15, color: COLORS.textMain }}>{r.title}</Text>
                        <Text style={{ ...TYPE.micro, color: COLORS.textMuted }}>{r.score.toUpperCase()}</Text>
                      </View>
                      <Text style={{ ...TYPE.label, color: COLORS.textSecondary, marginTop: 3 }}>{r.headline}</Text>
                    </View>
                  </View>
                  <Text style={{ ...TYPE.body, fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, marginTop: 12 }}>
                    {r.body}
                  </Text>
                </Card>
              ))}
            </View>
          )
        ) : /* ================= AUDITOR VIEW ================= */ auditTab === 'open' ? (
          <View style={{ gap: 12 }}>
            {OPEN_FINDINGS.map((f, i) => {
              return (
                <Card key={i} padded={false} style={{ overflow: 'hidden' }}>
                  <View style={{ paddingHorizontal: 16, paddingVertical: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                      <Text style={{ ...TYPE.h3, fontSize: 15, color: COLORS.textMain, flex: 1, lineHeight: 20 }}>
                        {f.title}
                      </Text>
                      {f.isRecurring && (
                        <View
                          style={{
                            backgroundColor: COLORS.dangerLight,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            borderRadius: RADIUS.pill,
                          }}
                        >
                          <Text style={{ ...TYPE.micro, color: COLORS.danger }}>BERULANG</Text>
                        </View>
                      )}
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 7 }}>
                      <MaterialIcons name="storefront" size={14} color={COLORS.textSecondary} />
                      <Text style={{ ...TYPE.body, fontSize: 13, color: COLORS.textSecondary }}>{f.outlet}</Text>
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
                      <View
                        style={{
                          backgroundColor: COLORS.surfaceSunken,
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          borderRadius: RADIUS.pill,
                        }}
                      >
                        <Text style={{ ...TYPE.micro, color: COLORS.textSecondary }}>{f.category.toUpperCase()}</Text>
                      </View>
                      <Text style={{ fontSize: 12, color: COLORS.textMuted }}>{f.date}</Text>
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                gap: 12,
                backgroundColor: COLORS.dangerLight,
                borderRadius: RADIUS.lg,
                padding: 16,
                borderWidth: 1,
                borderColor: 'rgba(220, 38, 38, 0.2)',
              }}
            >
              <MaterialIcons name="security" size={22} color={COLORS.danger} />
              <View style={{ flex: 1 }}>
                <Text style={{ ...TYPE.h3, fontSize: 14, color: COLORS.danger }}>Temuan Berulang (≥2x di Outlet yang Sama)</Text>
                <Text style={{ ...TYPE.body, fontSize: 12.5, color: COLORS.textSecondary, marginTop: 4, lineHeight: 18 }}>
                  Hanya menampilkan butir checklist yang tercatat tidak sesuai (NOK) sebanyak 2 kali atau lebih pada outlet yang sama.
                </Text>
              </View>
            </View>

            {[
              {
                outlet: 'Outlet Sudirman',
                title: 'Alat Pemadam Api Ringan (APAR) kedaluwarsa atau tekanan drop',
                category: 'K3 & KESELAMATAN',
                repeat_count: 2,
                severity: 'KRITIS',
                historyDates: ['5 Juli 2026', '12 Mei 2026'],
                notes: 'Masa berlaku habis sejak Juni 2026, belum ditukar dari temuan Mei lalu.',
              },
              {
                outlet: 'Outlet Kemang',
                title: 'Suhu Chiller & Freezer penyimpanan di luar toleransi standar SOP (> 4°C)',
                category: 'HIGIENITAS & SANITASI',
                repeat_count: 2,
                severity: 'KRITIS',
                historyDates: ['8 Juli 2026', '15 Juni 2026'],
                notes: 'Suhu chiller 8°C saat siang. Masalah paking pintu berulang.',
              },
              {
                outlet: 'Outlet Sudirman',
                title: 'Jalur evakuasi dan pintu darurat terhalang tumpukan stok barang',
                category: 'K3 & KESELAMATAN',
                repeat_count: 2,
                severity: 'MAJOR',
                historyDates: ['5 Juli 2026', '18 April 2026'],
                notes: 'Tumpukan kardus stok logistik menutupi akses pintu darurat.',
              },
              {
                outlet: 'Outlet Kelapa Gading',
                title: 'Karyawan tidak mengenakan atribut lengkap (Hairnet & Apron Bersih)',
                category: 'HIGIENITAS & SANITASI',
                repeat_count: 2,
                severity: 'MAJOR',
                historyDates: ['3 Juli 2026', '20 Mei 2026'],
                notes: '2 barista tidak mengenakan hairnet saat jam sibuk.',
              },
            ].map((rf, rfIdx) => (
              <Card key={rfIdx} padded={false} style={{ overflow: 'hidden' }}>
                <View style={{ paddingHorizontal: 16, paddingVertical: 15 }}>
                  {/* Outlet Header Badge */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        backgroundColor: COLORS.surfaceSunken,
                        paddingHorizontal: 9,
                        paddingVertical: 4.5,
                        borderRadius: RADIUS.sm,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                      }}
                    >
                      <MaterialIcons name="storefront" size={13} color={COLORS.primary} />
                      <Text style={{ fontSize: 12, fontWeight: '800', color: COLORS.textMain }}>
                        {rf.outlet}
                      </Text>
                    </View>

                    <View
                      style={{
                        backgroundColor: COLORS.dangerLight,
                        paddingHorizontal: 8,
                        paddingVertical: 3.5,
                        borderRadius: RADIUS.pill,
                        borderWidth: 1,
                        borderColor: 'rgba(220, 38, 38, 0.25)',
                      }}
                    >
                      <Text style={{ ...TYPE.micro, fontSize: 10, color: COLORS.danger, fontWeight: '800' }}>
                        {rf.repeat_count}x BERULANG
                      </Text>
                    </View>
                  </View>

                  <Text style={{ ...TYPE.h3, fontSize: 14.5, color: COLORS.textMain, lineHeight: 20 }}>
                    {rf.title}
                  </Text>

                  {/* History of Occurrences in this Outlet */}
                  <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.divider }}>
                    <Text style={{ ...TYPE.micro, color: COLORS.textMuted, marginBottom: 4 }}>
                      RIWAYAT TEMUAN DI OUTLET INI:
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      {rf.historyDates.map((dt, dIdx) => (
                        <View
                          key={dIdx}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 3,
                            backgroundColor: COLORS.dangerLight,
                            paddingHorizontal: 7,
                            paddingVertical: 3,
                            borderRadius: RADIUS.sm,
                          }}
                        >
                          <MaterialIcons name="event" size={12} color={COLORS.danger} />
                          <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.danger }}>
                            Inspeksi #{rf.historyDates.length - dIdx}: {dt}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Note */}
                  {rf.notes && (
                    <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 8, fontStyle: 'italic' }}>
                      Catatan: {rf.notes}
                    </Text>
                  )}

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
                    <Text style={{ ...TYPE.micro, color: COLORS.danger, fontWeight: '800' }}>
                      {rf.severity}
                    </Text>
                    <View
                      style={{
                        backgroundColor: COLORS.surfaceSunken,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: RADIUS.pill,
                      }}
                    >
                      <Text style={{ ...TYPE.micro, color: COLORS.textSecondary }}>{rf.category}</Text>
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ================= MODAL DETAIL SOP ================= */}
      <Modal
        visible={Boolean(activeSopModal)}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveSopModal(null)}
      >
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
          <View style={{ backgroundColor: COLORS.brandDeep, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 22 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ ...TYPE.micro, color: COLORS.onBrandMuted }}>
                  {(activeSopModal?.category || 'SOP').toUpperCase()} • {activeSopModal?.Points?.length || 0} POIN
                </Text>
                <Text style={{ ...TYPE.h1, fontSize: 19, color: COLORS.onBrand, marginTop: 6 }} numberOfLines={3}>
                  {activeSopModal?.title}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setActiveSopModal(null)}
                accessibilityLabel="Tutup dokumen SOP"
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: 'rgba(255,255,255,0.16)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons name="close" size={21} color={COLORS.onBrand} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 12 }}>
            {activeSopModal?.Points && activeSopModal.Points.length > 0 ? (
              activeSopModal.Points.map((pt, idx) => (
                <Card key={pt.id || idx}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 13 }}>
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: COLORS.primaryLight,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.brandDark }}>
                        {pt.order_num || idx + 1}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ ...TYPE.h3, fontSize: 14.5, color: COLORS.textMain, lineHeight: 20 }}>
                        {pt.title}
                      </Text>
                      {pt.description ? (
                        <Text style={{ ...TYPE.body, fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, marginTop: 6 }}>
                          {pt.description}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </Card>
              ))
            ) : (
              <View style={{ paddingVertical: 48, alignItems: 'center' }}>
                <MaterialIcons name="info-outline" size={32} color={COLORS.textMuted} />
                <Text style={{ ...TYPE.body, fontSize: 13, color: COLORS.textSecondary, marginTop: 10 }}>
                  Belum ada rincian poin pada SOP ini.
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={{ padding: 16, paddingBottom: 24, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.divider }}>
            <TouchableOpacity
              onPress={() => setActiveSopModal(null)}
              activeOpacity={0.85}
              style={{
                minHeight: 52,
                borderRadius: RADIUS.md,
                backgroundColor: COLORS.brandDeep,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.onBrand }}>Tutup Dokumen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
