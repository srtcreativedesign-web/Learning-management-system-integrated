import React from 'react';
import { View, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../../theme';

/** Floating surface. Shadow, not an outline — outlines everywhere is what reads as a web admin panel. */
export function Card({
  children,
  style,
  padded = true,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: COLORS.surface,
          borderRadius: RADIUS.lg,
          padding: padded ? 16 : 0,
          ...SHADOW.card,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
