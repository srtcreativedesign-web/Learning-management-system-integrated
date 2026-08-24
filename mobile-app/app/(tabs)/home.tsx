import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { fetchInHouseSessionsApi, fetchOutletsApi } from '../../src/services/api';
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

  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [outletsMap, setOutletsMap] = useState<Record<string, string>>({});
  const [outletCount, setOutletCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const loadData = useCallback(async () => {
    setLoadError(false);
    try {
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
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    loadData().finally(() => setIsLoading(false));
  }, [user, loadData]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData().finally(() => setIsRefreshing(false));
  }, [loadData]);

  const passedCount = recentSessions.filter((s) => s.is_passed).length;
  const passRate = recentSessions.length > 0 ? `${Math.round((passedCount / recentSessions.length) * 100)}%` : '—';

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
        {/* Stat strip lives inside the brand block, so the light area opens with real content. */}
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
            value={recentSessions.length}
            label={isTrainer ? 'Sesi In-House' : 'Audit Selesai'}
            loading={isLoading}
          />
          <View style={{ width: 1, height: 34, backgroundColor: 'rgba(255,255,255,0.18)' }} />
          <HeaderStat value={passRate} label={isTrainer ? 'Kelulusan' : 'Kepatuhan'} loading={isLoading} />
          <View style={{ width: 1, height: 34, backgroundColor: 'rgba(255,255,255,0.18)' }} />
          <HeaderStat value={outletCount || '—'} label="Outlet Aktif" loading={isLoading} />
        </View>
      </BrandHeader>

        <View style={{ paddingHorizontal: 20 }}>
        {/* Agenda card overlaps the header curve — that overlap is what creates depth. */}
        <View style={{ marginTop: -26, ...SHADOW.raised }}>
          <Card style={{ padding: 18 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: COLORS.warningLight,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: RADIUS.pill,
                }}
              >
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.warning }} />
                <Text style={{ ...TYPE.micro, color: COLORS.warningDeep }}>AGENDA HARI INI</Text>
              </View>
              <Text style={{ ...TYPE.label, color: COLORS.textSecondary }}>10:00 WIB</Text>
            </View>

            <Text style={{ ...TYPE.h2, color: COLORS.textMain, marginBottom: 6 }}>
              {isTrainer ? 'Outlet Grand Indonesia' : 'Outlet Senayan City'}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 18 }}>
              <MaterialIcons name="location-on" size={15} color={COLORS.primary} />
              <Text style={{ ...TYPE.body, fontSize: 13, color: COLORS.textSecondary, flex: 1 }}>
                {isTrainer ? 'West Mall Lt. 3 • Barista & Front Service' : 'Lt. LG • Kepatuhan K3 & 5S'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/outlets')}
              activeOpacity={0.85}
              style={{
                backgroundColor: COLORS.brandDeep,
                minHeight: 52,
                borderRadius: RADIUS.md,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.onBrand }}>
                {isTrainer ? 'Mulai Penilaian On-Site' : 'Mulai Inspeksi'}
              </Text>
              <MaterialIcons name="arrow-forward" size={18} color={COLORS.onBrand} />
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

        {/* ================= QUICK ACTIONS ================= */}
        <Text style={{ ...TYPE.h3, color: COLORS.textMain, marginTop: 28, marginBottom: 12 }}>Akses Cepat</Text>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          {[
            {
              icon: (isTrainer ? 'menu-book' : 'assignment-late') as keyof typeof MaterialIcons.glyphMap,
              title: isTrainer ? 'Modul SOP' : 'Temuan',
              subtitle: isTrainer ? 'Panduan standar' : 'Status perbaikan',
              tint: COLORS.primary,
              route: '/(tabs)/findings' as const,
            },
            {
              icon: 'storefront' as keyof typeof MaterialIcons.glyphMap,
              title: 'Outlet',
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

        {/* ================= RECENT SESSIONS ================= */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, marginBottom: 12 }}>
          <Text style={{ ...TYPE.h3, color: COLORS.textMain }}>
            {isTrainer ? 'Evaluasi Terbaru' : 'Audit Terbaru'}
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
              <Text style={{ ...TYPE.h3, color: COLORS.textMain, marginTop: 14 }}>Belum ada riwayat</Text>
              <Text style={{ ...TYPE.body, fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', marginTop: 4 }}>
                Mulai penilaian dari daftar outlet untuk mengisi riwayat ini.
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
                        `• PIC Outlet: ${session.pic_name || 'Store Manager Cabang'}\n` +
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

        {/* Grade legend — makes the color rails self-explanatory. */}
        {!isLoading && recentSessions.length > 0 && (
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
