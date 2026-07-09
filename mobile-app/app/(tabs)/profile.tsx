import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Profile Card */}
      <View className="bg-white rounded-xl p-6 border border-gray-100 mb-4 items-center">
        <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-3">
          <Text className="text-primary text-3xl font-bold">BS</Text>
        </View>
        <Text className="text-lg font-bold text-text-main">Budi Santoso</Text>
        <Text className="text-sm text-gray-500">budi.trainer@sobathr.com</Text>
        <View className="bg-primary/10 px-4 py-1 rounded-full mt-2">
          <Text className="text-primary text-xs font-semibold">Auditor Internal</Text>
        </View>
      </View>

      {/* Stats */}
      <View className="bg-white rounded-xl p-4 border border-gray-100 mb-4">
        <Text className="font-bold text-text-main mb-3">Statistik Audit</Text>
        <View className="flex-row justify-between mb-3">
          <Text className="text-sm text-gray-500">Total Inspeksi</Text>
          <Text className="font-semibold text-text-main">47</Text>
        </View>
        <View className="flex-row justify-between mb-3">
          <Text className="text-sm text-gray-500">Temuan Ditemukan</Text>
          <Text className="font-semibold text-text-main">23</Text>
        </View>
        <View className="flex-row justify-between mb-3">
          <Text className="text-sm text-gray-500">Rata-rata Compliance</Text>
          <Text className="font-semibold text-green-600">87%</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-gray-500">Divisi</Text>
          <Text className="font-semibold text-text-main">Training & Development</Text>
        </View>
      </View>

      {/* Menu */}
      <View className="bg-white rounded-xl border border-gray-100 mb-4">
        <TouchableOpacity className="p-4 flex-row justify-between items-center border-b border-gray-50">
          <Text className="text-text-main">📊  Laporan & Analisa</Text>
          <Text className="text-gray-400">›</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-4 flex-row justify-between items-center border-b border-gray-50">
          <Text className="text-text-main">🏢  Pembagian Divisi</Text>
          <Text className="text-gray-400">›</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-4 flex-row justify-between items-center border-b border-gray-50">
          <Text className="text-text-main">📋  Template Checklist</Text>
          <Text className="text-gray-400">›</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-4 flex-row justify-between items-center">
          <Text className="text-red-500">🚪  Keluar</Text>
          <Text className="text-gray-400">›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
