import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

function FindingCard({ title, outlet, category, date, isRecurring }: { title: string; outlet: string; category: string; date: string; isRecurring?: boolean }) {
  return (
    <View className="bg-white rounded-xl p-4 border border-gray-100 mb-3">
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-2">
          <Text className="font-semibold text-text-main">{title}</Text>
          <Text className="text-xs text-gray-500 mt-1">📍 {outlet}</Text>
        </View>
        {isRecurring && (
          <View className="bg-red-50 px-2 py-1 rounded-full">
            <Text className="text-xs font-semibold text-red-600">🔁 Berulang</Text>
          </View>
        )}
      </View>
      <View className="flex-row items-center mt-2 pt-2 border-t border-gray-50">
        <View className="bg-gray-100 px-2 py-1 rounded mr-2">
          <Text className="text-xs text-gray-600">{category}</Text>
        </View>
        <Text className="text-xs text-gray-400">{date}</Text>
      </View>
    </View>
  );
}

export default function FindingsScreen() {
  const [activeTab, setActiveTab] = useState<'open' | 'recurring'>('open');

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Tab Switcher */}
      <View className="flex-row bg-white rounded-xl p-1 border border-gray-200 mb-4">
        <TouchableOpacity 
          className={`flex-1 py-3 rounded-lg items-center ${activeTab === 'open' ? 'bg-primary' : ''}`}
          onPress={() => setActiveTab('open')}
        >
          <Text className={`font-semibold text-sm ${activeTab === 'open' ? 'text-white' : 'text-gray-500'}`}>
            Temuan Terbuka (5)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 py-3 rounded-lg items-center ${activeTab === 'recurring' ? 'bg-primary' : ''}`}
          onPress={() => setActiveTab('recurring')}
        >
          <Text className={`font-semibold text-sm ${activeTab === 'recurring' ? 'text-white' : 'text-gray-500'}`}>
            Berulang (3)
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'open' ? (
        <>
          <FindingCard 
            title="Alat pemadam kebakaran kedaluwarsa" 
            outlet="Outlet Sudirman" 
            category="K3" 
            date="7 Juli 2026" 
          />
          <FindingCard 
            title="SOP tidak dipasang di area produksi" 
            outlet="Outlet Tangerang" 
            category="Operasional" 
            date="6 Juli 2026" 
            isRecurring
          />
          <FindingCard 
            title="Suhu chiller di luar batas toleransi" 
            outlet="Outlet Kemang" 
            category="Quality" 
            date="5 Juli 2026" 
          />
          <FindingCard 
            title="Dokumen izin operasional belum diperbarui" 
            outlet="Outlet BSD" 
            category="Legalitas" 
            date="4 Juli 2026" 
          />
          <FindingCard 
            title="Pekerja tidak menggunakan APD lengkap" 
            outlet="Outlet Kelapa Gading" 
            category="K3" 
            date="3 Juli 2026" 
            isRecurring
          />
        </>
      ) : (
        <>
          <View className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-4">
            <Text className="font-bold text-amber-800 text-sm mb-1">Perhatian!</Text>
            <Text className="text-xs text-amber-700">Temuan berulang menandakan adanya masalah sistemik yang perlu ditangani di tingkat manajemen.</Text>
          </View>
          <FindingCard 
            title="SOP tidak dipasang di area produksi" 
            outlet="3 outlet berbeda" 
            category="Operasional" 
            date="Ditemukan 5x dalam 30 hari" 
            isRecurring 
          />
          <FindingCard 
            title="Pekerja tidak menggunakan APD lengkap" 
            outlet="4 outlet berbeda" 
            category="K3" 
            date="Ditemukan 8x dalam 30 hari" 
            isRecurring 
          />
          <FindingCard 
            title="Kebersihan area penyimpanan kurang" 
            outlet="2 outlet berbeda" 
            category="Hygiene" 
            date="Ditemukan 3x dalam 30 hari" 
            isRecurring 
          />
        </>
      )}
    </ScrollView>
  );
}
