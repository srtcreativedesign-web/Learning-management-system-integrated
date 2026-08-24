import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOW } from '../../theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  variant?: 'primary' | 'ghost';
}

export function Button({ label, onPress, isLoading = false, iconName, variant = 'primary' }: ButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isLoading, busy: isLoading }}
      activeOpacity={0.85}
      style={{
        minHeight: 54,
        borderRadius: RADIUS.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isPrimary ? COLORS.brandDeep : COLORS.surfaceSunken,
        opacity: isLoading ? 0.75 : 1,
        ...(isPrimary ? SHADOW.card : null),
      }}
    >
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : COLORS.brandDeep} size="small" />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 15.5, fontWeight: '700', color: isPrimary ? COLORS.onBrand : COLORS.brandDeep }}>
            {label}
          </Text>
          {iconName && <MaterialIcons name={iconName} size={19} color={isPrimary ? COLORS.onBrand : COLORS.brandDeep} />}
        </View>
      )}
    </TouchableOpacity>
  );
}
