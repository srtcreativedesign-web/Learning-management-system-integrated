import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

const PALETTE = {
  headerBg: '#2C7B9E', // System Dark Primary (#419CC3 family)
  headerAccent: '#419CC3', // System Primary
  background: '#F8FAFC', // Neutral Background
  surface: '#FFFFFF',
  textMain: '#0B1C30',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  primary: '#419CC3', // Brand System Color
  primaryLight: '#EFF8FC', // Soft Primary Tint
  primaryBorder: '#BEE3F2', // Light Border for Badge
  danger: '#EF4444',
  dangerLight: '#FEF2F2',
};

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Keluar',
      'Apakah Anda yakin ingin keluar dari akun ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  const isTrainer = user?.role?.toUpperCase().includes('TRAINER') || user?.email?.includes('trainer');
  const displayName = user?.name || (isTrainer ? 'Budi Santoso' : 'Dian Pratama');
  const displayRole = isTrainer ? 'Trainer & Asesor TnD' : 'Auditor Lapangan';
  const headerTitle = isTrainer ? 'Profil Trainer' : 'Profil Auditor';
  const displayEmail = user?.email || (isTrainer ? 'budi.trainer@sobathr.com' : 'dian.auditor@sobathr.com');

  return (
    <View style={{ flex: 1, backgroundColor: PALETTE.background }}>
      <StatusBar barStyle="light-content" backgroundColor={PALETTE.headerBg} />
      
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= TOP BLUE HEADER BANNER ================= */}
        <View 
          style={{ 
            backgroundColor: PALETTE.headerBg, 
            paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 52,
            paddingBottom: 72,
            paddingHorizontal: 20,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
          {/* Top Bar: Back, Title, Notification, Settings */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <TouchableOpacity 
                onPress={() => router.back()} 
                activeOpacity={0.7}
                style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' }}
              >
                <MaterialIcons name="arrow-back" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.3 }}>
                {headerTitle}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => Alert.alert('Notifikasi', 'Tidak ada notifikasi baru.')}
                style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' }}
              >
                <MaterialIcons name="notifications-none" size={20} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => Alert.alert('Pengaturan', 'Fitur konfigurasi sistem.')}
                style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' }}
              >
                <MaterialIcons name="settings" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ================= FLOATING HERO PROFILE CARD ================= */}
        <View style={{ paddingHorizontal: 20, marginTop: -46 }}>
          <View 
            style={{ 
              backgroundColor: PALETTE.surface, 
              borderRadius: 24, 
              paddingTop: 54,
              paddingBottom: 22,
              paddingHorizontal: 20,
              alignItems: 'center',
              position: 'relative',
              shadowColor: '#0F172A',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
              elevation: 6,
              borderWidth: 1,
              borderColor: 'rgba(226, 232, 240, 0.8)',
            }}
          >
            {/* Sticking Out Avatar */}
            <View 
              style={{ 
                position: 'absolute', 
                top: -46, 
                alignSelf: 'center',
                width: 92, 
                height: 92, 
                borderRadius: 46, 
                backgroundColor: PALETTE.surface,
                padding: 4,
                shadowColor: '#0F172A',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.15,
                shadowRadius: 10,
                elevation: 8,
              }}
            >
              <Image 
                source={{ uri: isTrainer ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' }} 
                style={{ width: '100%', height: '100%', borderRadius: 42 }} 
              />
              
              {/* Verified Blue Badge */}
              <View 
                style={{ 
                  position: 'absolute', 
                  bottom: 2, 
                  right: 2, 
                  backgroundColor: PALETTE.primary, 
                  padding: 4, 
                  borderRadius: 14, 
                  borderWidth: 2.5, 
                  borderColor: '#FFFFFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons name="check" size={12} color="#FFFFFF" />
              </View>
            </View>

            {/* Profile Info */}
            <Text style={{ fontSize: 20, fontWeight: '700', color: PALETTE.textMain, letterSpacing: -0.4, marginTop: 4 }}>
              {displayName}
            </Text>

            {/* Role Badge */}
            <View 
              style={{ 
                backgroundColor: PALETTE.primaryLight, 
                paddingHorizontal: 12, 
                paddingVertical: 4, 
                borderRadius: 20, 
                marginTop: 6, 
                borderWidth: 1, 
                borderColor: PALETTE.primaryBorder,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '700', color: PALETTE.primary }}>
                {displayRole}
              </Text>
            </View>

            {/* Email */}
            <Text style={{ fontSize: 12, fontWeight: '500', color: PALETTE.textSecondary, marginTop: 6 }}>
              {displayEmail}
            </Text>
          </View>
        </View>

        {/* ================= 2 STAT CARDS ROW ================= */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginTop: 16 }}>
          {/* Stat 1 */}
          <View 
            style={{ 
              flex: 1, 
              backgroundColor: PALETTE.surface, 
              paddingVertical: 14,
              paddingHorizontal: 14,
              borderRadius: 16, 
              flexDirection: 'row',
              alignItems: 'center', 
              gap: 12,
              shadowColor: '#0F172A',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
              borderWidth: 1,
              borderColor: PALETTE.border,
            }}
          >
            <View 
              style={{ 
                width: 42, 
                height: 42, 
                borderRadius: 21, 
                backgroundColor: PALETTE.primary, 
                alignItems: 'center', 
                justifyContent: 'center',
              }}
            >
              <MaterialIcons name={isTrainer ? "groups" : "assignment-turned-in"} size={22} color="#FFFFFF" />
            </View>
            <View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: PALETTE.textMain, lineHeight: 24 }}>
                {isTrainer ? '18' : '24'}
              </Text>
              <Text style={{ fontSize: 11, fontWeight: '500', color: PALETTE.textSecondary }}>
                {isTrainer ? 'Sesi In-House' : 'Audit Selesai'}
              </Text>
            </View>
          </View>

          {/* Stat 2 */}
          <View 
            style={{ 
              flex: 1, 
              backgroundColor: PALETTE.surface, 
              paddingVertical: 14,
              paddingHorizontal: 14,
              borderRadius: 16, 
              flexDirection: 'row',
              alignItems: 'center', 
              gap: 12,
              shadowColor: '#0F172A',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
              borderWidth: 1,
              borderColor: PALETTE.border,
            }}
          >
            <View 
              style={{ 
                width: 42, 
                height: 42, 
                borderRadius: 21, 
                backgroundColor: PALETTE.primary, 
                alignItems: 'center', 
                justifyContent: 'center',
              }}
            >
              <MaterialIcons name={isTrainer ? "bar-chart" : "storefront"} size={22} color="#FFFFFF" />
            </View>
            <View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: PALETTE.textMain, lineHeight: 24 }}>
                {isTrainer ? '42' : '45'}
              </Text>
              <Text style={{ fontSize: 11, fontWeight: '500', color: PALETTE.textSecondary }}>
                {isTrainer ? 'Staf Dievaluasi' : 'Total Outlet'}
              </Text>
            </View>
          </View>
        </View>

        {/* ================= PENGATURAN AKUN SECTION ================= */}
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: PALETTE.textMain, marginBottom: 12, letterSpacing: -0.2 }}>
            Pengaturan Akun
          </Text>

          <View 
            style={{ 
              backgroundColor: PALETTE.surface, 
              borderRadius: 16, 
              overflow: 'hidden',
              shadowColor: '#0F172A',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
              borderWidth: 1,
              borderColor: PALETTE.border,
            }}
          >
            {/* Menu Item 1: Informasi Pribadi */}
            <TouchableOpacity 
              onPress={() => Alert.alert('Informasi Pribadi', `Nama: ${displayName}\nEmail: ${displayEmail}\nRole: ${displayRole}`)}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                paddingVertical: 14, 
                paddingHorizontal: 16,
                borderBottomWidth: 1, 
                borderBottomColor: '#F1F5F9' 
              }} 
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: PALETTE.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons name="person" size={20} color={PALETTE.primary} />
                </View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: PALETTE.textMain }}>
                  Informasi Pribadi
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
            </TouchableOpacity>

            {/* Menu Item 2: Spesialisasi / Sertifikasi */}
            <TouchableOpacity 
              onPress={() => Alert.alert('Spesialisasi & Sertifikasi', `Status Sertifikasi: Terverifikasi Aktif\nKeahlian: Asesmen Standar Operasional Gerai & Evaluasi Barista.`)}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                paddingVertical: 14, 
                paddingHorizontal: 16,
                borderBottomWidth: 1, 
                borderBottomColor: '#F1F5F9' 
              }} 
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: PALETTE.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons name="assignment-turned-in" size={20} color={PALETTE.primary} />
                </View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: PALETTE.textMain }}>
                  {isTrainer ? 'Sertifikasi Trainer & Asesor' : 'Spesialisasi Audit'}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
            </TouchableOpacity>

            {/* Menu Item 3: Notifikasi */}
            <TouchableOpacity 
              onPress={() => Alert.alert('Pengaturan Notifikasi', 'Notifikasi jadwal kunjungan dan update SOP aktif.')}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                paddingVertical: 14, 
                paddingHorizontal: 16,
              }} 
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: PALETTE.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons name="notifications" size={20} color={PALETTE.primary} />
                </View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: PALETTE.textMain }}>
                  Notifikasi
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ================= LOGOUT BUTTON ================= */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <TouchableOpacity 
            onPress={handleLogout}
            style={{ 
              backgroundColor: PALETTE.dangerLight, 
              borderWidth: 1, 
              borderColor: '#FECDD3',
              borderRadius: 16, 
              paddingVertical: 14, 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 8,
            }}
            activeOpacity={0.7}
          >
            <MaterialIcons name="logout" size={18} color={PALETTE.danger} />
            <Text style={{ fontSize: 13, fontWeight: '700', color: PALETTE.danger }}>
              Keluar Akun
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
