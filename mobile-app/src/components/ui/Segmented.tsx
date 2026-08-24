import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, SHADOW, TYPE } from '../../theme';

interface SegmentedProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  /** Use on top of the brand header. */
  onBrand?: boolean;
}

/** Sliding-pill segmented control. Replaces the full-width solid blue block. */
export function Segmented<T extends string>({ options, value, onChange, onBrand }: SegmentedProps<T>) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: onBrand ? 'rgba(255,255,255,0.14)' : COLORS.surfaceSunken,
        borderRadius: RADIUS.pill,
        padding: 4,
        gap: 4,
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={{
              flex: 1,
              minHeight: 40,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 8,
              borderRadius: RADIUS.pill,
              backgroundColor: active ? COLORS.surface : 'transparent',
              ...(active ? SHADOW.card : null),
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                ...TYPE.label,
                color: active ? COLORS.brandDeep : onBrand ? COLORS.onBrandMuted : COLORS.textSecondary,
              }}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
