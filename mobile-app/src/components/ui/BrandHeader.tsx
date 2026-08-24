import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS, TYPE } from '../../theme';

interface BrandHeaderProps {
  title: string;
  subtitle?: string;
  /** Rendered on the right of the title row (avatar, icon buttons). */
  right?: React.ReactNode;
  /** Rendered below the title, still inside the brand block (stat strips, tabs). */
  children?: React.ReactNode;
  /** Extra bottom padding so a card can overlap the curve. */
  overlap?: boolean;
}

/**
 * Deep brand block that the content scrolls out from under.
 * Decorative circles instead of a gradient library — same depth, no new dependency.
 */
export function BrandHeader({ title, subtitle, right, children, overlap }: BrandHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: -800,
          left: 0,
          right: 0,
          height: 800,
          backgroundColor: COLORS.brandDeep,
        }}
      />

      <View
      style={{
        backgroundColor: COLORS.brandDeep,
        paddingTop: insets.top + 14,
        paddingHorizontal: 20,
        paddingBottom: overlap ? 42 : 22,
        borderBottomLeftRadius: RADIUS.xl,
        borderBottomRightRadius: RADIUS.xl,
        overflow: 'hidden',
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: -80,
          right: -60,
          width: 220,
          height: 220,
          borderRadius: 110,
          backgroundColor: 'rgba(255,255,255,0.07)',
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 40,
          right: -130,
          width: 240,
          height: 240,
          borderRadius: 120,
          backgroundColor: 'rgba(255,255,255,0.05)',
        }}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ ...TYPE.h1, color: COLORS.onBrand }} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={{ ...TYPE.body, color: COLORS.onBrandMuted, marginTop: 4 }} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {right}
      </View>

      {children}
      </View>
    </View>
  );
}

/**
 * Solid brand strip behind the status bar.
 * BrandHeader scrolls with the content (so overlapping cards aren't clipped by the
 * ScrollView frame) — this keeps the notch area opaque once it scrolls away.
 */
export function BrandStatusScrim() {
  const insets = useSafeAreaInsets();
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: insets.top,
        backgroundColor: COLORS.brandDeep,
        zIndex: 10,
      }}
    />
  );
}
