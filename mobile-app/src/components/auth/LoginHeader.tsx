import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function LoginHeader() {
  return (
    <View className="mb-8">
      {/* Brand Icon & Badge */}
      <View className="flex-row items-center space-x-3 mb-6">
        <View className="w-12 h-12 bg-primary rounded-2xl items-center justify-center shadow-sm">
          <MaterialIcons name="school" size={26} color="#FFFFFF" />
        </View>
        <View>
          <Text className="text-primary font-bold text-base tracking-wider uppercase">
            TnD LMS & Audit
          </Text>
          <Text className="text-slate-400 text-xs font-medium">
            Mobile Field & Learning Portal
          </Text>
        </View>
      </View>

      {/* Main Headline */}
      <Text className="text-slate-900 text-3xl font-extrabold tracking-tight">
        Selamat Datang
      </Text>
      <Text className="text-slate-500 text-sm mt-2 leading-relaxed">
        Masuk untuk mengakses materi pembelajaran, training outlet, dan inspeksi audit.
      </Text>
    </View>
  );
}
