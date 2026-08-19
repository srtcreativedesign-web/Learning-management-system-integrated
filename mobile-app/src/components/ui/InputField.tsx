import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  onToggleSecure?: () => void;
  keyboardType?: 'default' | 'email-address';
  iconName?: keyof typeof MaterialIcons.glyphMap;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export function InputField({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry, 
  onToggleSecure, 
  keyboardType = 'default',
  iconName,
  autoCapitalize = 'none'
}: InputFieldProps) {
  return (
    <View className="mb-4">
      <Text className="text-slate-600 text-xs font-semibold mb-2 tracking-wide uppercase">
        {label}
      </Text>
      <View className="flex-row items-center bg-slate-50 rounded-xl border border-slate-200 px-3.5">
        {iconName && (
          <MaterialIcons 
            name={iconName} 
            size={20} 
            color="#94A3B8" 
            style={{ marginRight: 8 }} 
          />
        )}
        <TextInput
          className="flex-1 py-3.5 text-slate-800 text-base"
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
        {onToggleSecure && (
          <TouchableOpacity 
            onPress={onToggleSecure} 
            className="p-1"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <MaterialIcons 
              name={secureTextEntry ? 'visibility-off' : 'visibility'} 
              size={20} 
              color="#94A3B8" 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
