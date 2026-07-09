import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

interface TabSwitcherProps {
  activeTab: 'login' | 'register';
  onTabChange: (tab: 'login' | 'register') => void;
}

export function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <View className="flex-row bg-gray-100 rounded-lg p-1 mb-6">
      <TouchableOpacity
        className={`flex-1 py-3 rounded-md items-center ${activeTab === 'login' ? 'bg-white shadow-sm' : ''}`}
        onPress={() => onTabChange('login')}
      >
        <Text className={`font-semibold text-sm ${activeTab === 'login' ? 'text-text-main' : 'text-gray-400'}`}>
          Login
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`flex-1 py-3 rounded-md items-center ${activeTab === 'register' ? 'bg-white shadow-sm' : ''}`}
        onPress={() => onTabChange('register')}
      >
        <Text className={`font-semibold text-sm ${activeTab === 'register' ? 'text-text-main' : 'text-gray-400'}`}>
          Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}
