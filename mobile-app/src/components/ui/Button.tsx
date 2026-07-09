import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
}

export function Button({ label, onPress, isLoading = false }: ButtonProps) {
  return (
    <TouchableOpacity
      className="bg-primary py-4 rounded-xl items-center mb-4"
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-white font-bold text-lg">{label}</Text>
      )}
    </TouchableOpacity>
  );
}
