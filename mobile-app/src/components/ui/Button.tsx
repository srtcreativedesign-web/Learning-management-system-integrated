import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  iconName?: keyof typeof MaterialIcons.glyphMap;
}

export function Button({ label, onPress, isLoading = false, iconName }: ButtonProps) {
  return (
    <TouchableOpacity
      className="bg-primary py-4 px-6 rounded-xl flex-row items-center justify-center mb-4 shadow-sm active:opacity-90"
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <View className="flex-row items-center justify-center">
          <Text className="text-white font-bold text-base mr-2">{label}</Text>
          {iconName && (
            <MaterialIcons name={iconName} size={20} color="#FFFFFF" />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
