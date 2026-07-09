import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

function OutletCard({ name, division, lastAudit, status }: { name: string; division: string; lastAudit: string; status: string }) {
  const statusColor = status === 'Compliant' ? '#10B981' : '#F59E0B';
  
  return (
    <TouchableOpacity className="bg-white rounded-xl p-4 border border-gray-100 mb-3">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="font-semibold text-text-main text-base">{name}</Text>
          <Text className="text-xs text-gray-500 mt-1">Divisi: {division}</Text>
        </View>
        <View className="px-3 py-1 rounded-full" style={{ backgroundColor: status === 'Compliant' ? '#ECFDF5' : '#FFFBEB' }}>
          <Text className="text-xs font-semibold" style={{ color: statusColor }}>{status}</Text>
        </View>
      </View>
      <View className="flex-row items-center mt-2 pt-2 border-t border-gray-50">
        <Text className="text-xs text-gray-400">Audit terakhir: {lastAudit}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function OutletsScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Search placeholder */}
      <View className="bg-white rounded-xl px-4 py-3 border border-gray-200 mb-4">
        <Text className="text-gray-400">🔍  Cari outlet atau divisi...</Text>
      </View>

      {/* Division Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <TouchableOpacity className="bg-primary px-4 py-2 rounded-full mr-2">
          <Text className="text-white text-xs font-semibold">Semua</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-white px-4 py-2 rounded-full mr-2 border border-gray-200">
          <Text className="text-gray-600 text-xs font-semibold">Operasional</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-white px-4 py-2 rounded-full mr-2 border border-gray-200">
          <Text className="text-gray-600 text-xs font-semibold">Gudang</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-white px-4 py-2 rounded-full mr-2 border border-gray-200">
          <Text className="text-gray-600 text-xs font-semibold">Produksi</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Outlet List */}
      <OutletCard name="Outlet Kemang" division="Operasional Gudang" lastAudit="8 Juli 2026" status="Compliant" />
      <OutletCard name="Outlet Sudirman" division="Operasional Gudang" lastAudit="5 Juli 2026" status="Non-Compliant" />
      <OutletCard name="Outlet Kelapa Gading" division="Produksi" lastAudit="3 Juli 2026" status="Compliant" />
      <OutletCard name="Outlet BSD" division="Operasional Gudang" lastAudit="1 Juli 2026" status="Compliant" />
      <OutletCard name="Outlet Tangerang" division="Produksi" lastAudit="28 Juni 2026" status="Non-Compliant" />
    </ScrollView>
  );
}
