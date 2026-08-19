import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, SafeAreaView, Platform, StatusBar, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { fetchOutletsApi } from '../../src/services/api';

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

  useEffect(() => {
    fetchOutletsApi().then((data) => {
      if (data && data.length > 0) {
        setRealOutlets(data);
      }
    });
  }, []);

  const defaultTrainerOutlets: OutletItem[] = [
    { id: '1', name: 'Outlet Grand Indonesia', division: 'Barista & F&B', lastDate: '18 Agt 2026', status: 'Lulus Sesi', grade: 'SB', score: 96, staffCount: 6 },
    { id: '2', name: 'Outlet Senayan City', division: 'Service & POS', lastDate: '15 Agt 2026', status: 'Lulus Sesi', grade: 'B', score: 84, staffCount: 4 },
    { id: '3', name: 'Outlet Central Park', division: 'Kitchen & Higienitas', lastDate: '10 Agt 2026', status: 'Perlu Re-Training', grade: 'C', score: 68, staffCount: 5 },
    { id: '4', name: 'Outlet Mall Kelapa Gading', division: 'All Station', lastDate: 'Hari Ini', status: 'Jadwal Hari Ini', staffCount: 8 },
    { id: '5', name: 'Outlet Kota Kasablanka', division: 'Barista & Kasir', lastDate: '20 Agt 2026', status: 'Mendatang', staffCount: 6 },
  ];

  const defaultAuditorOutlets: OutletItem[] = [
    { id: '1', name: 'Outlet Kemang', division: 'Operasional & 5S', lastDate: '8 Juli 2026', status: 'Compliant', score: 95 },
    { id: '2', name: 'Outlet Sudirman', division: 'Keselamatan & Kasir', lastDate: '5 Juli 2026', status: 'Non-Compliant', score: 64 },
    { id: '3', name: 'Outlet Kelapa Gading', division: 'Standar Sanitasi', lastDate: '3 Juli 2026', status: 'Compliant', score: 92 },
    { id: '4', name: 'Outlet BSD City', division: 'Operasional Gudang', lastDate: '1 Juli 2026', status: 'Compliant', score: 88 },
    { id: '5', name: 'Outlet Tangerang', division: 'Peralatan & POS', lastDate: '28 Juni 2026', status: 'Non-Compliant', score: 70 },
  ];

  const baseOutlets: OutletItem[] = realOutlets.length > 0
    ? realOutlets.map((o, idx) => ({
        id: o.id || String(idx),
        name: o.name,
        division: o.device_name || (o.device_code ? `Kode: ${o.device_code}` : 'Barista & Kasir POS'),
        lastDate: 'Database Terkini',
        status: o.status === 'active' ? (isTrainer ? 'Siap Training' : 'Compliant') : 'Non-Compliant',
        grade: (['SB', 'B', 'SB', 'B', 'C', 'SB'][idx % 6]) as any,
        score: 85 + (idx % 12),
        staffCount: 5 + (idx % 4),
      }))
    : (isTrainer ? defaultTrainerOutlets : defaultAuditorOutlets);

  const outlets = baseOutlets.filter((item) => {
    const matchesFilter = filter === 'Semua' || item.status === filter;
    const matchesSearch = !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStartActivity = (outletName: string) => {
    if (isTrainer) {
      Alert.alert(
        'Mulai In-House Training',
        `Apakah Anda ingin membuka checklist penilaian (SB/B/C/K) untuk ${outletName}?`,
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Buka Checklist', onPress: () => Alert.alert('Lembar Penilaian Siap', 'Checklist 15 butir standar outlet siap dinilai.') },
        ]
      );
    } else {
      Alert.alert(
        'Mulai Audit Lapangan',
        `Mulai inspeksi kepatuhan untuk ${outletName}?`,
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Mulai Inspeksi', onPress: () => Alert.alert('Audit Dimulai', 'Form audit kepatuhan dibuka.') },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Top Header Bar with Breathing Room */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#0B1C30', letterSpacing: -0.4 }}>
          {isTrainer ? 'Kunjungan In-House Training' : 'Daftar Outlet Audit'}
        </Text>
        <Text style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>
          {isTrainer ? 'Pilih outlet untuk evaluasi kompetensi on-site (SB/B/C/K)' : 'Pilih outlet untuk inspeksi kepatuhan & temuan'}
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Input */}
        <View className="bg-white rounded-xl px-3.5 py-2.5 border border-slate-200 mb-3 flex-row items-center space-x-2">
          <MaterialIcons name="search" size={20} color="#94A3B8" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={isTrainer ? 'Cari nama cabang outlet...' : 'Cari outlet atau area inspeksi...'}
            placeholderTextColor="#94A3B8"
            className="text-slate-700 text-xs flex-1 p-0"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        {(isTrainer ? ['Semua', 'Jadwal Hari Ini', 'Lulus Sesi', 'Perlu Re-Training'] : ['Semua', 'Compliant', 'Non-Compliant']).map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full mr-2 border ${filter === f ? 'bg-[#419CC3] border-[#419CC3]' : 'bg-white border-slate-200'}`}
          >
            <Text className={`text-xs font-semibold ${filter === f ? 'text-white' : 'text-slate-600'}`}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Outlet Cards */}
      {outlets.map((outlet) => {
        const isSuccess = outlet.status.includes('Lulus') || outlet.status === 'Compliant';
        const isWarning = outlet.status.includes('Re-Training') || outlet.status === 'Non-Compliant';

        return (
          <TouchableOpacity
            key={outlet.id}
            onPress={() => handleStartActivity(outlet.name)}
            activeOpacity={0.7}
            className="bg-white rounded-xl p-4 border border-slate-200/80 mb-3 shadow-xs"
          >
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1 pr-2">
                <Text className="font-bold text-slate-800 text-sm">{outlet.name}</Text>
                <Text className="text-xs text-slate-500 mt-0.5 flex-row items-center">
                  <MaterialIcons name="business" size={12} color="#64748B" /> {outlet.division}
                </Text>
              </View>
              
              {/* Badge */}
              <View
                className="px-2.5 py-1 rounded-md"
                style={{
                  backgroundColor: isSuccess ? '#ECFDF5' : isWarning ? '#FEF2F2' : '#EFF6FF',
                }}
              >
                <Text
                  className="text-[11px] font-bold"
                  style={{
                    color: isSuccess ? '#059669' : isWarning ? '#DC2626' : '#2563EB',
                  }}
                >
                  {outlet.grade ? `Grade ${outlet.grade} • ` : ''}{outlet.status}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between mt-2 pt-2.5 border-t border-slate-100">
              <View className="flex-row items-center space-x-1">
                <MaterialIcons name="event" size={13} color="#94A3B8" />
                <Text className="text-[11px] text-slate-400">
                  {isTrainer ? 'Kunjungan: ' : 'Audit terakhir: '}{outlet.lastDate}
                </Text>
              </View>

              <View className="flex-row items-center space-x-1 bg-[#419CC3]/10 px-2 py-1 rounded-md">
                <Text className="text-[11px] font-bold text-[#419CC3]">
                  {isTrainer ? 'Buka Penilaian' : 'Mulai Audit'}
                </Text>
                <MaterialIcons name="chevron-right" size={14} color="#419CC3" />
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
      </ScrollView>
    </SafeAreaView>
  );
}


