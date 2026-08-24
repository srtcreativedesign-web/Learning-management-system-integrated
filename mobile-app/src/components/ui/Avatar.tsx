import React from 'react';
import { View, Text } from 'react-native';
import { COLORS } from '../../theme';
import { initials } from '../../utils/initials';

interface AvatarProps {
  name?: string | null;
  size?: number;
  /** Light ring, used on the dashboard header. */
  bordered?: boolean;
}

/** Initials avatar. Replaces stock photos: no network, no wrong-person picture. */
export function Avatar({ name, size = 40, bordered = false }: AvatarProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: bordered ? 2 : 0,
        borderColor: COLORS.primaryBorder,
      }}
    >
      <Text style={{ fontSize: size * 0.38, fontWeight: '700', color: COLORS.brandDark }}>
        {initials(name)}
      </Text>
    </View>
  );
}
