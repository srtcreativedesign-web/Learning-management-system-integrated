import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, ActivityIndicator, TextInput, Platform, SafeAreaView, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { fetchSopsApi } from '../../src/services/api';

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
  const isTrainer = user?.role?.toUpperCase().includes('TRAINER') || user?.email?.includes('trainer');
  
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

  useEffect(() => {
    loadSops();
  }, []);

  const filteredSops = sops.filter((s) => {
    const matchesCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || s.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header Bar */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
        <View className="flex-row items-center justify-between">
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#0B1C30', letterSpacing: -0.4 }}>
            {isTrainer ? 'Pustaka SOP & Standar Kerja' : 'Laporan Temuan Audit'}
          </Text>
          {isTrainer && (
            <TouchableOpacity
              onPress={loadSops}
              className="p-1.5 bg-white border border-slate-200 rounded-lg"
              activeOpacity={0.7}
            >
              <MaterialIcons name="refresh" size={18} color="#419CC3" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>
          {isTrainer ? 'Dokumen SOP resmi yang diunggah dari Web Admin' : 'Daftar ketidaksesuaian hasil inspeksi lapangan'}
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >

        {isTrainer ? (
          /* ================= TRAINER VIEW ================= */
          <>
            {/* Trainer Tab Switcher */}
            <View className="flex-row bg-white rounded-xl p-1 border border-slate-200 mb-4">
              <TouchableOpacity 
                className={`flex-1 py-2.5 rounded-lg items-center ${trainerTab === 'modules' ? 'bg-[#419CC3]' : ''}`}
                onPress={() => setTrainerTab('modules')}
              >
                <Text className={`font-bold text-xs ${trainerTab === 'modules' ? 'text-white' : 'text-slate-600'}`}>
                  Dokumen SOP ({sops.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className={`flex-1 py-2.5 rounded-lg items-center ${trainerTab === 'rubric' ? 'bg-[#419CC3]' : ''}`}
                onPress={() => setTrainerTab('rubric')}
              >
                <Text className={`font-bold text-xs ${trainerTab === 'rubric' ? 'text-white' : 'text-slate-600'}`}>
                  Pedoman Skala (SB/B/C/K)
                </Text>
              </TouchableOpacity>
            </View>

            {trainerTab === 'modules' ? (
              <View>
                {/* Search Bar */}
                <View className="bg-white rounded-xl px-3.5 py-2.5 border border-slate-200 mb-3 flex-row items-center space-x-2">
                  <MaterialIcons name="search" size={20} color="#94A3B8" />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Cari judul SOP dari Web Admin..."
                    placeholderTextColor="#94A3B8"
                    className="flex-1 text-xs text-slate-700 p-0"
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                      <MaterialIcons name="close" size={16} color="#94A3B8" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Category Filters */}
                <View className="flex-row gap-2 mb-3">
                  {[
                    { id: 'ALL', label: 'Semua Kategori' },
                    { id: 'HEAD_OFFICE', label: 'Head Office' },
                    { id: 'OPERASIONAL', label: 'Operasional Gerai' },
                  ].map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg border ${selectedCategory === cat.id ? 'bg-[#419CC3] border-[#419CC3]' : 'bg-white border-slate-200'}`}
                      activeOpacity={0.7}
                    >
                      <Text className={`text-[11px] font-bold ${selectedCategory === cat.id ? 'text-white' : 'text-slate-600'}`}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* SOP List State */}
                {loadingSops ? (
                  <View className="py-12 items-center justify-center">
                    <ActivityIndicator size="small" color="#419CC3" />
                    <Text className="text-xs text-slate-400 mt-2 font-medium">Memuat dokumen SOP dari database...</Text>
                  </View>
                ) : filteredSops.length === 0 ? (
                  <View className="bg-white rounded-2xl p-8 border border-slate-200 items-center justify-center my-4">
                    <MaterialIcons name="folder-open" size={40} color="#CBD5E1" />
                    <Text className="text-slate-700 font-bold text-sm mt-3">Belum Ada Dokumen SOP</Text>
                    <Text className="text-slate-400 text-xs text-center mt-1">
                      Dokumen SOP yang diunggah di Web Admin akan otomatis muncul di sini.
                    </Text>
                  </View>
                ) : (
                  filteredSops.map((sop) => {
                    const pointCount = sop.Points?.length ?? sop._count?.Points ?? 0;
                    const isHO = sop.category === 'HEAD_OFFICE';

                    return (
                      <TouchableOpacity
                        key={sop.id}
                        onPress={() => setActiveSopModal(sop)}
                        activeOpacity={0.7}
                        className="bg-white rounded-xl p-4 border border-slate-200 mb-3 shadow-2xs"
                      >
                        <View className="flex-row justify-between items-start mb-2">
                          <View className="flex-1 pr-2">
                            <Text className="font-bold text-slate-800 text-sm leading-snug">{sop.title}</Text>
                            <Text className="text-xs text-slate-400 mt-1 font-mono">ID: {sop.id.slice(0, 8)}</Text>
                          </View>
                          <View className={`px-2 py-1 rounded-md border ${isHO ? 'bg-indigo-50 border-indigo-200' : 'bg-emerald-50 border-emerald-200'}`}>
                            <Text className={`text-[10px] font-bold ${isHO ? 'text-indigo-700' : 'text-emerald-700'}`}>
                              {sop.category}
                            </Text>
                          </View>
                        </View>

                        <View className="flex-row items-center justify-between mt-2 pt-2.5 border-t border-slate-100">
                          <View className="flex-row items-center space-x-1">
                            <MaterialIcons name="format-list-numbered" size={14} color="#64748B" />
                            <Text className="text-[11px] text-slate-600 font-semibold">
                              {pointCount} Butir Standar Kerja
                            </Text>
                          </View>

                          <View className="flex-row items-center space-x-0.5 bg-[#419CC3]/10 px-2 py-1 rounded-md">
                            <Text className="text-[11px] font-bold text-[#419CC3]">Lihat Detail SOP</Text>
                            <MaterialIcons name="chevron-right" size={14} color="#419CC3" />
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>
            ) : (
              <View>
                {/* Rubric View */}
                <View className="bg-white rounded-xl p-4 border border-slate-200 mb-3">
                  <View className="flex-row items-center space-x-2 mb-2">
                    <View className="w-8 h-8 rounded-lg bg-emerald-500 items-center justify-center">
                      <Text className="text-white font-black text-xs">SB</Text>
                    </View>
                    <View className="ml-2">
                      <Text className="font-bold text-slate-800 text-sm">Sangat Baik (Skor 5)</Text>
                      <Text className="text-[11px] text-emerald-700 font-semibold">Memenuhi 100% SOP + Proaktif</Text>
                    </View>
                  </View>
                  <Text className="text-xs text-slate-600 leading-relaxed">
                    Staf melakukan langkah kerja dengan sempurna, konsisten, cepat, dan menunjukkan inisiatif pelayanan terbaik tanpa perlu supervisi.
                  </Text>
                </View>

                <View className="bg-white rounded-xl p-4 border border-slate-200 mb-3">
                  <View className="flex-row items-center space-x-2 mb-2">
                    <View className="w-8 h-8 rounded-lg bg-blue-500 items-center justify-center">
                      <Text className="text-white font-black text-xs">B</Text>
                    </View>
                    <View className="ml-2">
                      <Text className="font-bold text-slate-800 text-sm">Baik (Skor 4)</Text>
                      <Text className="text-[11px] text-blue-700 font-semibold">Sesuai Standar SOP Minimum</Text>
                    </View>
                  </View>
                  <Text className="text-xs text-slate-600 leading-relaxed">
                    Staf menjalankan instruksi kerja dengan tepat dan benar, namun sesekali membutuhkan panduan minor pada situasi sibuk.
                  </Text>
                </View>

                <View className="bg-white rounded-xl p-4 border border-slate-200 mb-3">
                  <View className="flex-row items-center space-x-2 mb-2">
                    <View className="w-8 h-8 rounded-lg bg-amber-500 items-center justify-center">
                      <Text className="text-white font-black text-xs">C</Text>
                    </View>
                    <View className="ml-2">
                      <Text className="font-bold text-slate-800 text-sm">Cukup (Skor 3)</Text>
                      <Text className="text-[11px] text-amber-700 font-semibold">Butuh Pengawasan Berkala</Text>
                    </View>
                  </View>
                  <Text className="text-xs text-slate-600 leading-relaxed">
                    Terdapat beberapa kelalaian kecil dalam urutan kerja atau kebersihan workstation, perlu supervisi berkala dari Store Manager.
                  </Text>
                </View>

                <View className="bg-white rounded-xl p-4 border border-slate-200 mb-3">
                  <View className="flex-row items-center space-x-2 mb-2">
                    <View className="w-8 h-8 rounded-lg bg-rose-500 items-center justify-center">
                      <Text className="text-white font-black text-xs">K</Text>
                    </View>
                    <View className="ml-2">
                      <Text className="font-bold text-slate-800 text-sm">Kurang (Skor 1 - 2)</Text>
                      <Text className="text-[11px] text-rose-700 font-semibold">Wajib Re-Training</Text>
                    </View>
                  </View>
                  <Text className="text-xs text-slate-600 leading-relaxed">
                    Tidak memenuhi standar higienitas/SOP, berpotensi menurunkan kualitas rasa atau kepuasan pelanggan. Wajib dijadwalkan training ulang.
                  </Text>
                </View>
              </View>
            )}
          </>
        ) : (
          /* ================= AUDITOR VIEW ================= */
          <>
            {/* Auditor Tabs */}
            <View className="flex-row bg-white rounded-xl p-1 border border-slate-200 mb-4">
              <TouchableOpacity 
                className={`flex-1 py-2.5 rounded-lg items-center ${auditTab === 'open' ? 'bg-[#419CC3]' : ''}`}
                onPress={() => setAuditTab('open')}
              >
                <Text className={`font-bold text-xs ${auditTab === 'open' ? 'text-white' : 'text-slate-600'}`}>
                  Temuan Terbuka (5)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className={`flex-1 py-2.5 rounded-lg items-center ${auditTab === 'recurring' ? 'bg-[#419CC3]' : ''}`}
                onPress={() => setAuditTab('recurring')}
              >
                <Text className={`font-bold text-xs ${auditTab === 'recurring' ? 'text-white' : 'text-slate-600'}`}>
                  Berulang (3)
                </Text>
              </TouchableOpacity>
            </View>

            {auditTab === 'open' ? (
              <View>
                {[
                  { title: 'Alat pemadam kebakaran (APAR) kedaluwarsa', outlet: 'Outlet Sudirman', category: 'K3 & Keselamatan', date: '7 Juli 2026', isRecurring: false },
                  { title: 'SOP tidak dipasang di area kasir & kitchen', outlet: 'Outlet Tangerang', category: 'Operasional', date: '6 Juli 2026', isRecurring: true },
                  { title: 'Suhu chiller penyimpanan di luar batas toleransi', outlet: 'Outlet Kemang', category: 'Quality Assurance', date: '5 Juli 2026', isRecurring: false },
                  { title: 'Dokumen izin sanitasi belum diperbarui', outlet: 'Outlet BSD City', category: 'Legalitas', date: '4 Juli 2026', isRecurring: false },
                  { title: 'Pekerja tidak menggunakan celemek & hairnet', outlet: 'Outlet Kelapa Gading', category: 'Higienitas', date: '3 Juli 2026', isRecurring: true },
                ].map((f, i) => (
                  <View key={i} className="bg-white rounded-xl p-4 border border-slate-200 mb-3 shadow-2xs">
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-1 pr-2">
                        <Text className="font-bold text-slate-800 text-sm">{f.title}</Text>
                        <Text className="text-xs text-slate-500 mt-1">📍 {f.outlet}</Text>
                      </View>
                      {f.isRecurring && (
                        <View className="bg-rose-50 px-2 py-1 rounded-md border border-rose-200">
                          <Text className="text-[10px] font-bold text-rose-600">Berulang</Text>
                        </View>
                      )}
                    </View>
                    <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <View className="bg-slate-100 px-2 py-0.5 rounded">
                        <Text className="text-[10px] font-bold text-slate-600">{f.category}</Text>
                      </View>
                      <Text className="text-[11px] text-slate-400">{f.date}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View>
                <View className="bg-amber-50 rounded-xl p-3.5 border border-amber-200 mb-3">
                  <Text className="font-bold text-amber-800 text-xs mb-0.5">⚠️ Perhatian Khusus</Text>
                  <Text className="text-[11px] text-amber-700 leading-snug">
                    Temuan berulang menandakan adanya ketidakpatuhan sistemik yang perlu di-escalate ke Store Manager.
                  </Text>
                </View>

                <View className="bg-white rounded-xl p-4 border border-slate-200 mb-3">
                  <Text className="font-bold text-slate-800 text-sm">SOP tidak dipasang di area kasir & kitchen</Text>
                  <Text className="text-xs text-slate-500 mt-1">📍 Ditemukan di 3 Outlet Berbeda</Text>
                  <View className="mt-2 pt-2 border-t border-slate-100 flex-row justify-between items-center">
                    <Text className="text-[11px] font-bold text-rose-600">Ditemukan 5x dalam 30 hari</Text>
                    <View className="bg-slate-100 px-2 py-0.5 rounded">
                      <Text className="text-[10px] text-slate-600 font-bold">Operasional</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* ================= MODAL DETAIL SOP ================= */}
      <Modal
        visible={Boolean(activeSopModal)}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveSopModal(null)}
      >
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          {/* Modal Header */}
          <View style={{ paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <View className="flex-row items-center space-x-2 mb-1">
                <View className="bg-[#419CC3]/10 px-2 py-0.5 rounded">
                  <Text className="text-[10px] font-bold text-[#419CC3]">
                    {activeSopModal?.category || 'SOP'}
                  </Text>
                </View>
                <Text className="text-[11px] text-slate-400">
                  {activeSopModal?.Points?.length || 0} Poin Standar
                </Text>
              </View>
              <Text className="text-base font-bold text-slate-800" numberOfLines={2}>
                {activeSopModal?.title}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setActiveSopModal(null)}
              className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
            >
              <MaterialIcons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Modal Body - SOP Points List */}
          <ScrollView style={{ flex: 1, padding: 16 }} contentContainerStyle={{ paddingBottom: 40 }}>
            {activeSopModal?.Points && activeSopModal.Points.length > 0 ? (
              activeSopModal.Points.map((pt, idx) => (
                <View
                  key={pt.id || idx}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-3"
                >
                  <View className="flex-row items-start space-x-3 mb-1.5">
                    <View className="w-6 h-6 rounded-full bg-[#419CC3] items-center justify-center">
                      <Text className="text-white text-xs font-bold">{pt.order_num || idx + 1}</Text>
                    </View>
                    <Text className="text-sm font-bold text-slate-800 flex-1 ml-2 leading-snug">
                      {pt.title}
                    </Text>
                  </View>
                  {pt.description ? (
                    <Text className="text-xs text-slate-600 mt-2 ml-8 leading-relaxed">
                      {pt.description}
                    </Text>
                  ) : null}
                </View>
              ))
            ) : (
              <View className="py-12 items-center justify-center">
                <MaterialIcons name="info-outline" size={32} color="#94A3B8" />
                <Text className="text-xs text-slate-500 font-medium mt-2">
                  Belum ada rincian poin teks pada SOP ini.
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Modal Footer */}
          <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: '#FAFAFA' }}>
            <TouchableOpacity
              onPress={() => setActiveSopModal(null)}
              className="w-full py-3 bg-[#419CC3] rounded-xl items-center justify-center"
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-xs">Tutup Dokumen SOP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

