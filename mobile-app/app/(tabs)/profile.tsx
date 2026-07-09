import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Theme constants based on the provided HTML
const COLORS = {
  background: '#EFF4FF', // slightly blue background as requested
  surface: '#FFFFFF',
  primary: '#419CC3',
  textMain: '#0B1C30',
  textSecondary: '#3F484E',
  border: 'rgba(190, 200, 206, 0.2)',
  error: '#BA1A1A',
};

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // Navigate back to login
    router.replace('/');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }} // Extra padding for bottom navbar
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={{ alignItems: 'center', paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24 }}>
          <View style={{ position: 'relative', marginBottom: 24 }}>
            <View style={{ 
              width: 128, 
              height: 128, 
              borderRadius: 64, 
              borderWidth: 4, 
              borderColor: COLORS.surface, 
              overflow: 'hidden',
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
            }}>
              <Image 
                source={{ uri: 'https://i.pravatar.cc/300?img=11' }} 
                style={{ width: '100%', height: '100%' }} 
              />
            </View>
            <View style={{ 
              position: 'absolute', 
              bottom: 4, 
              right: 4, 
              backgroundColor: COLORS.primary, 
              padding: 6, 
              borderRadius: 20, 
              borderWidth: 4, 
              borderColor: '#E5EEFF',
            }}>
              <MaterialIcons name="verified" size={18} color="#FFFFFF" />
            </View>
          </View>
          
          <Text style={{ fontSize: 24, fontWeight: '700', color: COLORS.textMain, letterSpacing: -0.5 }}>Budi Santoso</Text>
          <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.primary, marginTop: 4 }}>Senior Auditor</Text>
          <Text style={{ fontSize: 12, fontWeight: '500', color: COLORS.textSecondary, marginTop: 4, opacity: 0.8 }}>Departemen Kepatuhan & Jaminan Kualitas</Text>
        </View>

        {/* Stats Section */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 24, gap: 16, marginBottom: 32 }}>
          {/* Stat 1 */}
          <View style={{ 
            flex: 1, 
            backgroundColor: COLORS.surface, 
            padding: 24, 
            borderRadius: 24, 
            alignItems: 'center', 
            justifyContent: 'center',
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.4)'
          }}>
            <Text style={{ fontSize: 24, fontWeight: '600', color: COLORS.primary }}>124</Text>
            <Text style={{ fontSize: 12, fontWeight: '500', color: COLORS.textSecondary, marginTop: 4 }}>Audit Selesai</Text>
          </View>
          {/* Stat 2 */}
          <View style={{ 
            flex: 1, 
            backgroundColor: COLORS.surface, 
            padding: 24, 
            borderRadius: 24, 
            alignItems: 'center', 
            justifyContent: 'center',
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.4)'
          }}>
            <Text style={{ fontSize: 24, fontWeight: '600', color: COLORS.primary }}>45</Text>
            <Text style={{ fontSize: 12, fontWeight: '500', color: COLORS.textSecondary, marginTop: 4 }}>Total Outlet</Text>
          </View>
        </View>

        {/* Account Settings List */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: COLORS.textMain, marginBottom: 16, paddingHorizontal: 8, opacity: 0.9 }}>Pengaturan Akun</Text>
          
          <View style={{ 
            backgroundColor: COLORS.surface, 
            borderRadius: 24, 
            overflow: 'hidden',
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.4)'
          }}>
            {/* Menu Item 1 */}
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24, borderBottomWidth: 1, borderBottomColor: COLORS.border }} activeOpacity={0.7}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(65, 156, 195, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 24 }}>
                  <MaterialIcons name="person" size={24} color={COLORS.primary} />
                </View>
                <Text style={{ fontSize: 16, fontWeight: '500', color: COLORS.textMain }}>Informasi Pribadi</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#6F787E" />
            </TouchableOpacity>

            {/* Menu Item 2 */}
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24, borderBottomWidth: 1, borderBottomColor: COLORS.border }} activeOpacity={0.7}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(65, 156, 195, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 24 }}>
                  <MaterialIcons name="assignment-turned-in" size={24} color={COLORS.primary} />
                </View>
                <Text style={{ fontSize: 16, fontWeight: '500', color: COLORS.textMain }}>Spesialisasi Audit</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#6F787E" />
            </TouchableOpacity>

            {/* Menu Item 3 */}
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24, borderBottomWidth: 1, borderBottomColor: COLORS.border }} activeOpacity={0.7}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(65, 156, 195, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 24 }}>
                  <MaterialIcons name="notifications" size={24} color={COLORS.primary} />
                </View>
                <Text style={{ fontSize: 16, fontWeight: '500', color: COLORS.textMain }}>Notifikasi</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#6F787E" />
            </TouchableOpacity>

            {/* Menu Item 4 */}
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24 }} activeOpacity={0.7}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(65, 156, 195, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 24 }}>
                  <MaterialIcons name="security" size={24} color={COLORS.primary} />
                </View>
                <Text style={{ fontSize: 16, fontWeight: '500', color: COLORS.textMain }}>Keamanan</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#6F787E" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Section */}
        <View style={{ paddingHorizontal: 24 }}>
          <TouchableOpacity 
            onPress={handleLogout}
            activeOpacity={0.7}
            style={{ 
              width: '100%', 
              paddingVertical: 24, 
              backgroundColor: COLORS.surface, 
              borderRadius: 24, 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: 'rgba(186, 26, 26, 0.2)',
              elevation: 4,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
            }}
          >
            <MaterialIcons name="logout" size={20} color={COLORS.error} style={{ marginRight: 8 }} />
            <Text style={{ color: COLORS.error, fontWeight: '600', fontSize: 14 }}>Keluar Akun</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
