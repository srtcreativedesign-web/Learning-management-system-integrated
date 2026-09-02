import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { BrandHeader, BrandStatusScrim } from '../../src/components/ui/BrandHeader';
import { Card } from '../../src/components/ui/Card';
import { Avatar } from '../../src/components/ui/Avatar';
import { COLORS, RADIUS, SHADOW, TOUCH_MIN, TYPE } from '../../src/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const isTrainer = user?.role?.toUpperCase().includes('TRAINER') || user?.email?.includes('trainer');
  const isManager = user?.role?.toUpperCase().includes('HRBP') || user?.role?.toUpperCase().includes('MANAGER') || user?.email?.includes('manager');
  const displayName = user?.name || (isTrainer ? 'Budi Santoso' : isManager ? 'Rian HRBP' : 'Dian Pratama');
  const displayRole = isTrainer ? 'Trainer & Asesor TnD' : isManager ? 'HRBP Manager' : 'Auditor Lapangan';
  const displayEmail = user?.email || (isTrainer ? 'budi.trainer@sobathr.com' : isManager ? 'manager.hrbp@sobathr.com' : 'dian.auditor@sobathr.com');

  const handleLogout = () => {
    Alert.alert('Konfirmasi Keluar', 'Apakah Anda yakin ingin keluar dari akun ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/');
        },
      },
    ]);
  };

  const menuItems: {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    onPress: () => void;
  }[] = [
    {
      icon: 'person-outline',
      label: 'Informasi Pribadi',
      onPress: () => Alert.alert('Informasi Pribadi', `Nama: ${displayName}\nEmail: ${displayEmail}\nRole: ${displayRole}`),
    },
    {
      icon: 'workspace-premium',
      label: isTrainer ? 'Sertifikasi Trainer & Asesor' : 'Spesialisasi Audit',
      onPress: () =>
        Alert.alert(
          'Sertifikasi',
          'Status: Terverifikasi Aktif\nKeahlian: Asesmen Standar Operasional Gerai & Evaluasi Barista.'
        ),
    },
    {
      icon: 'notifications-none',
      label: 'Notifikasi',
      onPress: () => Alert.alert('Pengaturan Notifikasi', 'Notifikasi jadwal kunjungan dan update SOP aktif.'),
    },
    {
      icon: 'help-outline',
      label: 'Bantuan & Dukungan',
      onPress: () => Alert.alert('Bantuan', 'Hubungi tim TnD Head Office untuk kendala aplikasi.'),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <BrandStatusScrim />


      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
      <BrandHeader
        title="Profil"
        overlap
        right={
          <TouchableOpacity
            onPress={() => Alert.alert('Pengaturan', 'Fitur konfigurasi sistem.')}
            accessibilityLabel="Pengaturan"
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
            <MaterialIcons name="settings" size={21} color={COLORS.onBrand} />
          </TouchableOpacity>
        }
      />

        <View style={{ paddingHorizontal: 20 }}>
        {/* Identity card overlaps the header curve. */}
        <View style={{ marginTop: -26, ...SHADOW.raised }}>
          <Card style={{ padding: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <Avatar name={displayName} size={62} />
              <View style={{ flex: 1 }}>
                <Text style={{ ...TYPE.h2, color: COLORS.textMain }} numberOfLines={1}>
                  {displayName}
                </Text>
                <View
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: COLORS.primaryLight,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: RADIUS.pill,
                    marginTop: 6,
                  }}
                >
                  <Text style={{ ...TYPE.micro, color: COLORS.brandDark }}>{displayRole.toUpperCase()}</Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginTop: 16,
                paddingTop: 14,
                borderTopWidth: 1,
                borderTopColor: COLORS.divider,
              }}
            >
              <MaterialIcons name="mail-outline" size={16} color={COLORS.textMuted} />
              <Text style={{ ...TYPE.body, fontSize: 13, color: COLORS.textSecondary, flex: 1 }} numberOfLines={1}>
                {displayEmail}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <MaterialIcons name="verified" size={15} color={COLORS.success} />
                <Text style={{ ...TYPE.micro, color: COLORS.success }}>AKTIF</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
          {[
            {
              icon: (isTrainer ? 'groups' : 'assignment-turned-in') as keyof typeof MaterialIcons.glyphMap,
              value: isTrainer ? '18' : '24',
              label: isTrainer ? 'Sesi In-House' : 'Audit Selesai',
              tint: COLORS.primary,
            },
            {
              icon: (isTrainer ? 'insights' : 'storefront') as keyof typeof MaterialIcons.glyphMap,
              value: isTrainer ? '42' : '45',
              label: isTrainer ? 'Staf Dievaluasi' : 'Total Outlet',
              tint: COLORS.success,
            },
          ].map((stat) => (
            <Card key={stat.label} style={{ flex: 1, padding: 16 }}>
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: RADIUS.md,
                  backgroundColor: `${stat.tint}1A`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <MaterialIcons name={stat.icon} size={20} color={stat.tint} />
              </View>
              <Text style={{ ...TYPE.display, fontSize: 26, color: COLORS.textMain }}>{stat.value}</Text>
              <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>{stat.label}</Text>
            </Card>
          ))}
        </View>

        {/* Menu */}
        <Text style={{ ...TYPE.h3, color: COLORS.textMain, marginTop: 28, marginBottom: 12 }}>Pengaturan Akun</Text>

        <Card padded={false} style={{ overflow: 'hidden' }}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.onPress}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                minHeight: TOUCH_MIN + 8,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderBottomWidth: idx < menuItems.length - 1 ? 1 : 0,
                borderBottomColor: COLORS.divider,
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: RADIUS.sm,
                  backgroundColor: COLORS.surfaceSunken,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons name={item.icon} size={20} color={COLORS.brandDark} />
              </View>
              <Text style={{ ...TYPE.body, fontSize: 14.5, color: COLORS.textMain, flex: 1 }}>{item.label}</Text>
              <MaterialIcons name="chevron-right" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </Card>

        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.8}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            minHeight: 52,
            borderRadius: RADIUS.md,
            backgroundColor: COLORS.dangerLight,
            marginTop: 20,
          }}
        >
          <MaterialIcons name="logout" size={19} color={COLORS.danger} />
          <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.danger }}>Keluar Akun</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 11, color: COLORS.textMuted, textAlign: 'center', marginTop: 18 }}>
          SobatHR TnD System • v1.0.0
        </Text>
        </View>
      </ScrollView>
    </View>
  );
}
