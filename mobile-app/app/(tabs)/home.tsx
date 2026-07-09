import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Theme constants based on the provided HTML
const COLORS = {
  background: '#F8F9FF',
  surface: '#FFFFFF',
  primary: '#419CC3',
  secondary: '#89B4E1',
  textMain: '#0B1C30',
  textSecondary: '#3F484E',
  border: '#BEC8CE',
  success: '#10B981',
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      {/* Top NavBar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: COLORS.primary }}>SobatHR</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={{ marginRight: 16 }}>
            <MaterialIcons name="notifications" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <View style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#C0E8FF', overflow: 'hidden' }}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?img=11' }} 
              style={{ width: '100%', height: '100%' }} 
            />
          </View>
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1, backgroundColor: COLORS.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section: Audit Schedule */}
        <View style={{ backgroundColor: COLORS.primary, borderRadius: 16, padding: 24, marginBottom: 24, overflow: 'hidden' }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1, opacity: 0.9, marginBottom: 4 }}>Mendatang</Text>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#FFFFFF', marginBottom: 16 }}>Jadwal Audit Terdekat</Text>
          
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
              <Text style={{ fontSize: 14, color: '#FFFFFF' }}>Persiapan Audit</Text>
              <Text style={{ fontSize: 20, fontWeight: '600', color: '#FFFFFF' }}>60%</Text>
            </View>
            <View style={{ width: '100%', height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' }}>
              <View style={{ width: '60%', height: '100%', backgroundColor: '#FFFFFF', borderRadius: 4 }} />
            </View>
          </View>
          
          <TouchableOpacity style={{ width: '100%', paddingVertical: 12, backgroundColor: '#FFFFFF', borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: COLORS.primary, fontWeight: '600', fontSize: 14, marginRight: 8 }}>Lihat Detail Kunjungan</Text>
            <MaterialIcons name="visibility" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Stat Cards */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
          {/* Card 1 */}
          <View style={{ flex: 1, backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(190,200,206,0.3)', marginRight: 8 }}>
            <MaterialIcons name="check-circle" size={28} color={COLORS.primary} style={{ marginBottom: 8 }} />
            <Text style={{ fontSize: 20, fontWeight: '600', color: COLORS.textMain }}>24</Text>
            <Text style={{ fontSize: 11, fontWeight: '500', color: COLORS.textSecondary, textAlign: 'center', marginTop: 4 }}>Audit Selesai</Text>
          </View>
          {/* Card 2 */}
          <View style={{ flex: 1, backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(190,200,206,0.3)', marginRight: 8 }}>
            <MaterialIcons name="location-on" size={28} color={COLORS.secondary} style={{ marginBottom: 8 }} />
            <Text style={{ fontSize: 20, fontWeight: '600', color: COLORS.textMain }}>8</Text>
            <Text style={{ fontSize: 11, fontWeight: '500', color: COLORS.textSecondary, textAlign: 'center', marginTop: 4 }}>Lokasi Visit</Text>
          </View>
          {/* Card 3 */}
          <View style={{ flex: 1, backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(190,200,206,0.3)' }}>
            <MaterialIcons name="analytics" size={28} color={COLORS.primary} style={{ marginBottom: 8 }} />
            <Text style={{ fontSize: 20, fontWeight: '600', color: COLORS.textMain }}>92%</Text>
            <Text style={{ fontSize: 11, fontWeight: '500', color: COLORS.textSecondary, textAlign: 'center', marginTop: 4 }}>Skor Kepatuhan</Text>
          </View>
        </View>

        {/* Audit Analytics Section */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: COLORS.textMain, marginBottom: 16 }}>Analitik Kinerja Audit</Text>
          
          <View style={{ backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(190,200,206,0.3)' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase' }}>Skor Kepatuhan Per Dept</Text>
              <MaterialIcons name="info-outline" size={20} color={COLORS.textSecondary} />
            </View>

            {/* Dept 1 */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, color: COLORS.textMain, marginBottom: 8 }}>Produksi & Gudang</Text>
              <View style={{ height: 16, justifyContent: 'center' }}>
                <View style={{ position: 'absolute', width: '100%', height: 8, backgroundColor: '#E5EEFF', borderRadius: 4 }} />
                <View style={{ position: 'absolute', width: '70%', height: 16, backgroundColor: 'rgba(137,180,225,0.4)', borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }} />
                <View style={{ position: 'absolute', width: '88%', height: 16, backgroundColor: COLORS.primary, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }} />
              </View>
            </View>

            {/* Dept 2 */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 14, color: COLORS.textMain, marginBottom: 8 }}>Administrasi & HR</Text>
              <View style={{ height: 16, justifyContent: 'center' }}>
                <View style={{ position: 'absolute', width: '100%', height: 8, backgroundColor: '#E5EEFF', borderRadius: 4 }} />
                <View style={{ position: 'absolute', width: '85%', height: 16, backgroundColor: 'rgba(137,180,225,0.4)', borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }} />
                <View style={{ position: 'absolute', width: '95%', height: 16, backgroundColor: COLORS.primary, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }} />
              </View>
            </View>

            {/* Legend */}
            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(190,200,206,0.2)', paddingTop: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: 'rgba(137,180,225,0.4)', marginRight: 6 }} />
                <Text style={{ fontSize: 10, fontWeight: '600', color: COLORS.textSecondary, textTransform: 'uppercase' }}>Target</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary, marginRight: 6 }} />
                <Text style={{ fontSize: 10, fontWeight: '600', color: COLORS.textSecondary, textTransform: 'uppercase' }}>Aktual</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Visit Reports */}
        <View style={{ marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: COLORS.textMain }}>Laporan Kunjungan</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.primary }}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {/* Report 1 */}
            <View style={{ width: '48%', backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(190,200,206,0.3)', overflow: 'hidden', marginBottom: 16 }}>
              <View style={{ height: 96, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="checklist" size={36} color={COLORS.primary} />
                <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(65,156,195,0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: COLORS.primary }}>DRAFT</Text>
                </View>
              </View>
              <View style={{ padding: 12, minHeight: 80, justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textMain, marginBottom: 8 }} numberOfLines={2}>Audit Pabrik A - Tangerang</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name="location-on" size={14} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
                  <Text style={{ fontSize: 10, fontWeight: '500', color: COLORS.textSecondary }} numberOfLines={1}>Tangerang, Banten</Text>
                </View>
              </View>
            </View>

            {/* Report 2 */}
            <View style={{ width: '48%', backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(190,200,206,0.3)', overflow: 'hidden', marginBottom: 16 }}>
              <View style={{ height: 96, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="person-search" size={36} color={COLORS.secondary} />
              </View>
              <View style={{ padding: 12, minHeight: 80, justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textMain, marginBottom: 8 }} numberOfLines={2}>Visit Trainer - Warehouse B</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name="schedule" size={14} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
                  <Text style={{ fontSize: 10, fontWeight: '500', color: COLORS.textSecondary }} numberOfLines={1}>2 Jam yang lalu</Text>
                </View>
              </View>
            </View>

            {/* Report 3 */}
            <View style={{ width: '48%', backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(190,200,206,0.3)', overflow: 'hidden', marginBottom: 16 }}>
              <View style={{ height: 96, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="shield" size={36} color={COLORS.primary} />
              </View>
              <View style={{ padding: 12, minHeight: 80, justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textMain, marginBottom: 8 }} numberOfLines={2}>Audit Keamanan - Head Office</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name="assessment" size={14} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
                  <Text style={{ fontSize: 10, fontWeight: '500', color: COLORS.textSecondary }} numberOfLines={1}>Skor: 95/100</Text>
                </View>
              </View>
            </View>

            {/* Report 4 */}
            <View style={{ width: '48%', backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(190,200,206,0.3)', overflow: 'hidden', marginBottom: 16 }}>
              <View style={{ height: 96, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="description" size={36} color={COLORS.secondary} />
              </View>
              <View style={{ padding: 12, minHeight: 80, justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textMain, marginBottom: 8 }} numberOfLines={2}>Laporan Mingguan Wilayah I</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name="history" size={14} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
                  <Text style={{ fontSize: 10, fontWeight: '500', color: COLORS.textSecondary }} numberOfLines={1}>Kemarin</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
