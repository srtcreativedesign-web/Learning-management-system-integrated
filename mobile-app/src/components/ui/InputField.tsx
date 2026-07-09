import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  onToggleSecure?: () => void;
  keyboardType?: 'default' | 'email-address';
}

export function InputField({ 
  label, value, onChangeText, placeholder, 
  secureTextEntry, onToggleSecure, keyboardType = 'default' 
}: InputFieldProps) {
  return (
    <View className="mb-4">
      <Text className="text-gray-500 text-xs font-medium mb-2 tracking-wide">{label}</Text>
      <View className="flex-row items-center bg-gray-50 rounded-lg border border-gray-200">
        <TextInput
          className="flex-1 px-4 py-4 text-text-main text-base"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
        {onToggleSecure && (
          <TouchableOpacity onPress={onToggleSecure} className="pr-4">
            <Text className="text-gray-400 text-lg">{secureTextEntry ? '👁' : '👁‍🗨'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
