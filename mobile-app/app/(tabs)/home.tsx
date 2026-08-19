import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

const PALETTE = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  primary: '#419CC3',
  primaryDark: '#2C7B9E',
  primaryLight: '#EFF8FC',
  primaryBorder: '#BEE3F2',
  textMain: '#0B1C30',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  cardBg: '#FFFFFF',
};

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const isTrainer = user?.role?.toUpperCase().includes('TRAINER') || user?.email?.includes('trainer');
  const firstName = user?.name ? user.name.split(' ')[0] : (isTrainer ? 'Budi' : 'Dian');
  const displayRole = isTrainer ? 'Trainer & Asesor TnD' : 'Auditor Lapangan';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PALETTE.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <StatusBar barStyle="dark-content" backgroundColor={PALETTE.background} />

      {/* ================= HEADER ================= */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14 }}>
        <View>
          <Text style={{ fontSize: 13, color: PALETTE.textSecondary, fontWeight: '500' }}>
            Selamat bertugas,
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}>
            <Text style={{ fontSize: 22, fontWeight: '700', color: PALETTE.textMain, letterSpacing: -0.5 }}>
              {firstName}
            </Text>
            <View style={{ backgroundColor: PALETTE.primaryLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: PALETTE.primaryBorder }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: PALETTE.primaryDark }}>
                {isTrainer ? 'TRAINER' : 'AUDITOR'}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity 
            onPress={() => Alert.alert('Notifikasi', 'Tidak ada notifikasi mendesak.')}
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: PALETTE.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: PALETTE.border }}
            activeOpacity={0.7}
          >
            <MaterialIcons name="notifications-none" size={20} color={PALETTE.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/profile')}
            style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: PALETTE.primaryBorder, overflow: 'hidden' }}
            activeOpacity={0.7}
          >
            <Image 
              source={{ uri: isTrainer ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }} 
              style={{ width: '100%', height: '100%' }} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= HERO CARD (Active Agenda) ================= */}
        <View 
          style={{ 
            backgroundColor: PALETTE.surface, 
            borderRadius: 20, 
            padding: 18, 
            marginTop: 8,
            marginBottom: 20,
            borderWidth: 1, 
            borderColor: PALETTE.border,
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.04,
            shadowRadius: 10,
            elevation: 2,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <View style={{ backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#FDE68A' }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#B45309' }}>
                Agenda Kunjungan Hari Ini
              </Text>
            </View>
            <Text style={{ fontSize: 11, fontWeight: '600', color: PALETTE.textSecondary }}>
              10:00 WIB
            </Text>
          </View>

          <Text style={{ fontSize: 17, fontWeight: '700', color: PALETTE.textMain, letterSpacing: -0.3, marginBottom: 6 }}>
            {isTrainer ? 'Outlet Grand Indonesia' : 'Outlet Senayan City'}
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 14 }}>
            <MaterialIcons name="location-on" size={14} color={PALETTE.primary} />
            <Text style={{ fontSize: 12, color: PALETTE.textSecondary, fontWeight: '500' }}>
              {isTrainer ? 'West Mall Lt. 3 • Barista & Front Service' : 'Lt. LG • Kepatuhan Standar K3 & 5S'}
            </Text>
          </View>

          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/outlets')}
            style={{ 
              backgroundColor: PALETTE.primary, 
              paddingVertical: 12, 
              borderRadius: 12, 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 6 
            }}
            activeOpacity={0.8}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>
              {isTrainer ? 'Mulai Penilaian On-Site (SB/B/C/K)' : 'Mulai Inspeksi Kepatuhan'}
            </Text>
            <MaterialIcons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* ================= METRICS ROW (2 Clean Symmetric Cards) ================= */}
        <Text style={{ fontSize: 15, fontWeight: '700', color: PALETTE.textMain, marginBottom: 12, letterSpacing: -0.2 }}>
          Ringkasan Performa
        </Text>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          {/* Metric 1 */}
          <View 
            style={{ 
              flex: 1, 
              backgroundColor: PALETTE.surface, 
              borderRadius: 16, 
              padding: 16, 
              borderWidth: 1, 
              borderColor: PALETTE.border,
              shadowColor: '#0F172A',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.03,
              shadowRadius: 6,
              elevation: 1,
            }}
          >
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: PALETTE.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <MaterialIcons name={isTrainer ? "groups" : "assignment-turned-in"} size={20} color={PALETTE.primary} />
            </View>
            <Text style={{ fontSize: 22, fontWeight: '700', color: PALETTE.textMain, letterSpacing: -0.5 }}>
              {isTrainer ? '18' : '24'}
            </Text>
            <Text style={{ fontSize: 11, fontWeight: '500', color: PALETTE.textSecondary, marginTop: 2 }}>
              {isTrainer ? 'Sesi In-House' : 'Audit Selesai'}
            </Text>
          </View>

          {/* Metric 2 */}
          <View 
            style={{ 
              flex: 1, 
              backgroundColor: PALETTE.surface, 
              borderRadius: 16, 
              padding: 16, 
              borderWidth: 1, 
              borderColor: PALETTE.border,
              shadowColor: '#0F172A',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.03,
              shadowRadius: 6,
              elevation: 1,
            }}
          >
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <MaterialIcons name="verified" size={20} color="#059669" />
            </View>
            <Text style={{ fontSize: 22, fontWeight: '700', color: PALETTE.textMain, letterSpacing: -0.5 }}>
              {isTrainer ? '94%' : '92%'}
            </Text>
            <Text style={{ fontSize: 11, fontWeight: '500', color: PALETTE.textSecondary, marginTop: 2 }}>
              {isTrainer ? 'Tingkat Kelulusan' : 'Tingkat Kepatuhan'}
            </Text>
          </View>
        </View>

        {/* ================= QUICK ACTIONS ================= */}
        <Text style={{ fontSize: 15, fontWeight: '700', color: PALETTE.textMain, marginBottom: 12, letterSpacing: -0.2 }}>
          Akses Cepat
        </Text>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/findings')}
            style={{ 
              flex: 1, 
              backgroundColor: PALETTE.surface, 
              borderRadius: 14, 
              padding: 14, 
              borderWidth: 1, 
              borderColor: PALETTE.border,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
            activeOpacity={0.7}
          >
            <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: PALETTE.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name={isTrainer ? "menu-book" : "assignment-late"} size={18} color={PALETTE.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: PALETTE.textMain }}>
                {isTrainer ? 'Modul SOP' : 'Laporan Temuan'}
              </Text>
              <Text style={{ fontSize: 10, color: PALETTE.textSecondary, marginTop: 1 }}>
                {isTrainer ? 'Panduan Standar' : 'Status Perbaikan'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/outlets')}
            style={{ 
              flex: 1, 
              backgroundColor: PALETTE.surface, 
              borderRadius: 14, 
              padding: 14, 
              borderWidth: 1, 
              borderColor: PALETTE.border,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
            activeOpacity={0.7}
          >
            <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: PALETTE.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="storefront" size={18} color={PALETTE.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: PALETTE.textMain }}>
                Semua Outlet
              </Text>
              <Text style={{ fontSize: 10, color: PALETTE.textSecondary, marginTop: 1 }}>
                Daftar Cabang
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ================= RECENT VISITS / SCHEDULE ================= */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: PALETTE.textMain, letterSpacing: -0.2 }}>
            {isTrainer ? 'Riwayat Evaluasi Terbaru' : 'Jadwal Audit Mendatang'}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/outlets')}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: PALETTE.primary }}>
              Lihat Semua
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: PALETTE.surface, borderRadius: 16, borderWidth: 1, borderColor: PALETTE.border, overflow: 'hidden' }}>
          {[
            { name: 'Outlet Grand Indonesia', date: 'Kemarin', status: isTrainer ? 'Lulus (SB)' : 'Compliant', score: '96%' },
            { name: 'Outlet Central Park', date: '3 Hari Lalu', status: isTrainer ? 'Lulus (B)' : 'Compliant', score: '84%' },
            { name: 'Outlet Senayan City', date: 'Besok', status: 'Jadwal Siap', score: '-' },
          ].map((item, idx) => (
            <View 
              key={idx}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                paddingVertical: 13, 
                paddingHorizontal: 16,
                borderBottomWidth: idx < 2 ? 1 : 0, 
                borderBottomColor: '#F1F5F9' 
              }}
            >
              <View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: PALETTE.textMain }}>
                  {item.name}
                </Text>
                <Text style={{ fontSize: 11, color: PALETTE.textSecondary, marginTop: 2 }}>
                  {item.date}
                </Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <View style={{ backgroundColor: item.status.includes('Lulus') || item.status === 'Compliant' ? '#ECFDF5' : '#F1F5F9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: item.status.includes('Lulus') || item.status === 'Compliant' ? '#059669' : '#64748B' }}>
                    {item.status}
                  </Text>
                </View>
                {item.score !== '-' && (
                  <Text style={{ fontSize: 11, fontWeight: '700', color: PALETTE.primaryDark, marginTop: 2 }}>
                    {item.score}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
