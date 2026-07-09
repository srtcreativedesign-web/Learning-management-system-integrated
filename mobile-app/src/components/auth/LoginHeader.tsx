import React from 'react';
import { View, Text } from 'react-native';

export function LoginHeader() {
  return (
    <View className="mb-8">
      {/* Logo */}
      <View className="w-12 h-12 bg-primary rounded-xl items-center justify-center mb-6">
        <Text className="text-white text-lg font-bold">TnD</Text>
      </View>
      {/* Big Headline */}
      <Text className="text-text-main text-3xl font-bold leading-tight">Selamat</Text>
      <Text className="text-text-main text-3xl font-bold leading-tight">Datang</Text>
      <Text className="text-gray-400 text-sm mt-3">
        Masuk untuk melanjutkan audit Anda.
      </Text>
    </View>
  );
}
