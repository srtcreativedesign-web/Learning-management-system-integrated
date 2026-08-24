import React from 'react';
import { View, Text } from 'react-native';
import { COLORS, GRADE_COLOR, RADIUS } from '../../theme';

/**
 * Grade chip. Tinted rather than solid — a solid saturated block next to
 * colored text made every row shout at the same volume.
 */
export function GradeBadge({ grade, size = 42 }: { grade?: string; size?: number }) {
  const color = (grade && GRADE_COLOR[grade]) || COLORS.textMuted;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: RADIUS.sm,
        backgroundColor: `${color}16`,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: grade && grade.length > 1 ? 14 : 16, fontWeight: '800', color }}>
        {grade || '-'}
      </Text>
    </View>
  );
}
