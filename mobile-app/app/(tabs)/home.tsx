import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { fetchInHouseSessionsApi, fetchOutletsApi, fetchAuditInspectionsApi } from '../../src/services/api';
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
        <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.onBrand, letterSpacing: -0.6 }}>{value}</Text>
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
  const { user } = useAuth();
  const isTrainer = user?.role?.toUpperCase().includes('TRAINER') || user?.email?.includes('trainer');
  const firstName = user?.name ? user.name.split(' ')[0] : isTrainer ? 'Budi' : 'Dian';

  // Trainer data
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  // Auditor data
  const [recentAudits, setRecentAudits] = useState<any[]>([]);

  const [outletsMap, setOutletsMap] = useState<Record<string, string>>({});
  const [outletCount, setOutletCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const loadData = useCallback(async () => {
    setLoadError(false);
    try {
      if (isTrainer) {
        // Load Trainer Training Sessions
        const [outletsData, sessionsData] = await Promise.all([fetchOutletsApi(), fetchInHouseSessionsApi()]);
        const oMap: Record<string, string> = {};
        if (Array.isArray(outletsData)) {
          outletsData.forEach((o: any) => {
            if (o.id) oMap[o.id] = o.name;
          });
          setOutletCount(outletsData.length);
        }
        setOutletsMap(oMap);
        setRecentSessions(Array.isArray(sessionsData) ? sessionsData : []);
      } else {
        // Load Auditor Field Inspections (OK / NOK)
        const [outletsData, auditInspections] = await Promise.all([fetchOutletsApi(), fetchAuditInspectionsApi()]);
        const oMap: Record<string, string> = {};
        if (Array.isArray(outletsData)) {
          outletsData.forEach((o: any) => {
            if (o.id) oMap[o.id] = o.name;
          });
          setOutletCount(outletsData.length);
        }
        setOutletsMap(oMap);
        setRecentAudits(Array.isArray(auditInspections) ? auditInspections : []);
      }
    } catch {
      setLoadError(true);
    }
  }, [isTrainer]);

  useEffect(() => {
    setIsLoading(true);
    loadData().finally(() => setIsLoading(false));
  }, [user, isTrainer, loadData]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData().finally(() => setIsRefreshing(false));
  }, [loadData]);

  // Trainer metrics
  const passedCount = recentSessions.filter((s) => s.is_passed).length;
  const passRate = recentSessions.length > 0 ? `${Math.round((passedCount / recentSessions.length) * 100)}%` : '—';

  // Auditor metrics
  const totalAuditCompliant = recentAudits.filter((a) => a.is_compliant).length;
  const auditComplianceRate =
    recentAudits.length > 0
      ? `${Math.round((totalAuditCompliant / recentAudits.length) * 100)}%`
      : '90%';

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
          subtitle={isTrainer ? 'Trainer & Asesor TnD' : 'Auditor Lapangan'}
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
            <HeaderStat
              value={isTrainer ? recentSessions.length : recentAudits.length}
              label={isTrainer ? 'Sesi In-House' : 'Audit Selesai'}
              loading={isLoading}
            />
            <View style={{ width: 1, height: 34, backgroundColor: 'rgba(255,255,255,0.18)' }} />
            <HeaderStat
              value={isTrainer ? passRate : auditComplianceRate}
              label={isTrainer ? 'Kelulusan' : 'Kepatuhan'}
              loading={isLoading}
            />
            <View style={{ width: 1, height: 34, backgroundColor: 'rgba(255,255,255,0.18)' }} />
            <HeaderStat value={outletCount || '—'} label="Outlet Aktif" loading={isLoading} />
          </View>
        </BrandHeader>

        <View style={{ paddingHorizontal: 20 }}>
          {/* Flexible On-Demand Inspection / Evaluation Card */}
          <View style={{ marginTop: -26, ...SHADOW.raised }}>
            <Card style={{ padding: 18 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: isTrainer ? COLORS.primaryLight : COLORS.successLight,
                    paddingHorizontal: 10,
                    paddingVertical: 4.5,
                    borderRadius: RADIUS.pill,
                  }}
                >
                  <MaterialIcons
                    name={isTrainer ? 'tune' : 'verified'}
                    size={14}
                    color={isTrainer ? COLORS.primary : COLORS.success}
                  />
                  <Text
                    style={{
                      ...TYPE.micro,
                      color: isTrainer ? COLORS.primary : COLORS.success,
                      fontWeight: '800',
                    }}
                  >
                    {isTrainer ? 'EVALUASI ON-SITE' : 'INSPEKSI FLEKSIBEL'}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <MaterialIcons name="all-inclusive" size={14} color={COLORS.textMuted} />
                  <Text style={{ ...TYPE.micro, color: COLORS.textMuted }}>KAPAN SAJA</Text>
                </View>
              </View>

              <Text style={{ ...TYPE.h2, color: COLORS.textMain, marginBottom: 4 }}>
                {isTrainer ? 'Penilaian On-Site Cabang' : 'Inspeksi Kepatuhan Lapangan'}
              </Text>

              <Text style={{ ...TYPE.body, fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 14 }}>
                {isTrainer
                  ? 'Pilih cabang untuk mengevaluasi standar operasional & kompetensi barista secara on-demand.'
                  : 'Pilih cabang outlet secara fleksibel untuk memulai checklist kepatuhan (OK / NOK) & foto temuan.'}
              </Text>

              {/* Quick Feature Pills */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {!isTrainer ? (
                  <>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.surfaceSunken, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm }}>
                      <MaterialIcons name="check-circle" size={13} color={COLORS.success} />
                      <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.textSecondary }}>Checklist OK/NOK</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.surfaceSunken, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm }}>
                      <MaterialIcons name="camera-alt" size={13} color={COLORS.danger} />
                      <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.textSecondary }}>Foto Temuan</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.surfaceSunken, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm }}>
                      <MaterialIcons name="draw" size={13} color={COLORS.primary} />
                      <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.textSecondary }}>Tanda Tangan PIC</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.surfaceSunken, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm }}>
                      <MaterialIcons name="grade" size={13} color={COLORS.warning} />
                      <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.textSecondary }}>Skor 1-5 & SB/B/C/K</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.surfaceSunken, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm }}>
                      <MaterialIcons name="menu-book" size={13} color={COLORS.primary} />
                      <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.textSecondary }}>Rubrik SOP</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.surfaceSunken, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm }}>
                      <MaterialIcons name="draw" size={13} color={COLORS.primary} />
                      <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.textSecondary }}>Tanda Tangan PIC</Text>
                    </View>
                  </>
                )}
              </View>

              <TouchableOpacity
                onPress={() => router.push('/(tabs)/outlets')}
                activeOpacity={0.85}
                style={{
                  backgroundColor: COLORS.brandDeep,
                  minHeight: 50,
                  borderRadius: RADIUS.md,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <MaterialIcons name="storefront" size={19} color={COLORS.onBrand} />
                <Text style={{ fontSize: 14.5, fontWeight: '700', color: COLORS.onBrand }}>
                  {isTrainer ? 'Pilih Outlet & Mulai Nilai' : 'Pilih Outlet & Mulai Inspeksi'}
                </Text>
                <MaterialIcons name="arrow-forward" size={17} color={COLORS.onBrand} />
              </TouchableOpacity>
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

          {/* Quick Actions */}
          <Text style={{ ...TYPE.h3, color: COLORS.textMain, marginTop: 28, marginBottom: 12 }}>Akses Cepat</Text>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            {[
              {
                icon: (isTrainer ? 'menu-book' : 'assignment-late') as keyof typeof MaterialIcons.glyphMap,
                title: isTrainer ? 'Modul SOP' : 'Temuan Audit',
                subtitle: isTrainer ? 'Panduan standar' : 'Status perbaikan',
                tint: COLORS.primary,
                route: '/(tabs)/findings' as const,
              },
              {
                icon: 'storefront' as keyof typeof MaterialIcons.glyphMap,
                title: isTrainer ? 'Outlet Training' : 'Outlet Audit',
                subtitle: 'Daftar cabang',
                tint: COLORS.success,
                route: '/(tabs)/outlets' as const,
              },
            ].map((action) => (
              <TouchableOpacity
                key={action.title}
                onPress={() => router.push(action.route)}
                activeOpacity={0.8}
                style={{ flex: 1 }}
              >
                <Card style={{ padding: 16, minHeight: 118, justifyContent: 'space-between' }}>
                  <View
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: RADIUS.md,
                      backgroundColor: `${action.tint}1A`,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MaterialIcons name={action.icon} size={22} color={action.tint} />
                  </View>
                  <View>
                    <Text style={{ ...TYPE.h3, color: COLORS.textMain }}>{action.title}</Text>
                    <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>{action.subtitle}</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          {/* ================= RECENT HISTORY ================= */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, marginBottom: 12 }}>
            <Text style={{ ...TYPE.h3, color: COLORS.textMain }}>
              {isTrainer ? 'Evaluasi Training Terbaru' : 'Riwayat Audit Kepatuhan (OK / NOK)'}
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

          {/* TRAINER VIEW: Shows In-House Sessions */}
          {isTrainer ? (
            <Card padded={false} style={{ overflow: 'hidden' }}>
              {isLoading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow last />
                </>
              ) : recentSessions.length === 0 ? (
                <View style={{ paddingVertical: 36, paddingHorizontal: 24, alignItems: 'center' }}>
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
                    <MaterialIcons name="event-available" size={28} color={COLORS.textMuted} />
                  </View>
                  <Text style={{ ...TYPE.h3, color: COLORS.textMain, marginTop: 14 }}>Belum ada riwayat training</Text>
                  <Text style={{ ...TYPE.body, fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', marginTop: 4 }}>
                    Mulai penilaian in-house training dari daftar outlet.
                  </Text>
                </View>
              ) : (
                recentSessions.slice(0, 5).map((session, idx) => {
                  const outletName = session.outlet?.name || outletsMap[session.outlet_id] || 'Outlet Cabang';
                  const dateStr = session.training_date
                    ? new Date(session.training_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
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
                            `• Trainer: ${session.trainer_name || 'Trainer TnD'}\n` +
                            `• Tanggal: ${dateStr}\n` +
                            `• Hasil Akhir: Grade ${grade} (${score}%)\n` +
                            `• Status: ${isPassed ? 'LULUS STANDAR ON-SITE' : 'PERLU RE-TRAINING'}` +
                            (session.notes ? `\n\nCatatan: ${session.notes}` : ''),
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
                        minHeight: 72,
                        paddingVertical: 12,
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
                        <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 3 }} numberOfLines={1}>
                          {session.trainee_name ? `${session.trainee_name} • ` : ''}
                          {dateStr}
                        </Text>
                      </View>

                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 17, fontWeight: '800', color: COLORS.textMain, letterSpacing: -0.4 }}>
                          {score}%
                        </Text>
                        <Text
                          style={{
                            ...TYPE.micro,
                            fontSize: 10.5,
                            color: isPassed ? COLORS.success : COLORS.danger,
                            marginTop: 2,
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
            /* AUDITOR VIEW: Shows OK/NOK Field Audit Inspections */
            <Card padded={false} style={{ overflow: 'hidden' }}>
              {isLoading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow last />
                </>
              ) : recentAudits.length === 0 ? (
                <View style={{ paddingVertical: 36, paddingHorizontal: 24, alignItems: 'center' }}>
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
                    <MaterialIcons name="fact-check" size={28} color={COLORS.textMuted} />
                  </View>
                  <Text style={{ ...TYPE.h3, color: COLORS.textMain, marginTop: 14 }}>Belum ada riwayat audit</Text>
                  <Text style={{ ...TYPE.body, fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', marginTop: 4 }}>
                    Mulai inspeksi kepatuhan (OK / NOK) dari daftar outlet.
                  </Text>
                </View>
              ) : (
                recentAudits.slice(0, 5).map((audit, idx) => {
                  const outletName = audit.outlet_name || outletsMap[audit.outlet_id] || 'Outlet Cabang';
                  const dateStr = audit.inspection_date
                    ? new Date(audit.inspection_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
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
                        const findingText =
                          audit.findings && audit.findings.length > 0
                            ? `\n\nTemuan Ketidaksesuaian (${audit.findings.length}):\n` +
                              audit.findings.map((f: any, i: number) => `${i + 1}. ${f.point_text || f.question} (${f.notes || 'Perlu perbaikan'})`).join('\n')
                            : '\n\nSemua poin checklist terpenuhi sesuai standar.';

                        Alert.alert(
                          `Laporan Audit: ${outletName}`,
                          `• Auditor: ${audit.auditor_name || 'Auditor Lapangan'}\n` +
                            `• Tanggal: ${dateStr}\n` +
                            `• Skor Kepatuhan: ${score}%\n` +
                            `• Hasil: ${okCount} Poin OK • ${nokCount} Temuan NOK\n` +
                            `• Status: ${isCompliant ? 'COMPLIANT (MEMENUHI STANDAR)' : 'NON-COMPLIANT (PERLU TINDAK LANJUT)'}` +
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
                        minHeight: 72,
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderBottomWidth: idx < Math.min(recentAudits.length, 5) - 1 ? 1 : 0,
                        borderBottomColor: COLORS.divider,
                      }}
                    >
                      {/* OK / NOK Icon Badge */}
                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: RADIUS.md,
                          backgroundColor: isCompliant ? COLORS.successLight : COLORS.dangerLight,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 1,
                          borderColor: isCompliant ? COLORS.success : COLORS.danger,
                        }}
                      >
                        <MaterialIcons
                          name={isCompliant ? 'check' : 'close'}
                          size={24}
                          color={isCompliant ? COLORS.success : COLORS.danger}
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={{ ...TYPE.h3, fontSize: 14, color: COLORS.textMain }} numberOfLines={1}>
                          {outletName}
                        </Text>
                        <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 3 }} numberOfLines={1}>
                          {okCount} OK • {nokCount > 0 ? `${nokCount} Temuan NOK` : 'Nihil Temuan'} • {dateStr}
                        </Text>
                      </View>

                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 17, fontWeight: '800', color: COLORS.textMain, letterSpacing: -0.4 }}>
                          {score}%
                        </Text>
                        <Text
                          style={{
                            ...TYPE.micro,
                            fontSize: 10.5,
                            color: isCompliant ? COLORS.success : COLORS.danger,
                            marginTop: 2,
                          }}
                        >
                          {isCompliant ? 'OK (COMPLIANT)' : 'NOK (TEMUAN)'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </Card>
          )}

          {/* Trainer Legend only shown for Trainer */}
          {isTrainer && !isLoading && recentSessions.length > 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 14, marginTop: 16 }}>
              {Object.entries(GRADE_COLOR).map(([g, c]) => (
                <View key={g} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c }} />
                  <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.textSecondary }}>{g}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
