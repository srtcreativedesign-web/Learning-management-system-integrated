import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { COLORS, RADIUS, TOUCH_MIN } from '../../theme';

type TabMeta = { label: string; icon: keyof typeof MaterialIcons.glyphMap };

const TRAINER_TABS: Record<string, TabMeta> = {
  home: { label: 'Training', icon: 'school' },
  outlets: { label: 'Riwayat', icon: 'history' },
  findings: { label: 'Modul SOP', icon: 'menu-book' },
  profile: { label: 'Profil', icon: 'person' },
};

const AUDITOR_TABS: Record<string, TabMeta> = {
  home: { label: 'Beranda', icon: 'home' },
  outlets: { label: 'Riwayat', icon: 'history' },
  findings: { label: 'Temuan', icon: 'assignment-late' },
  profile: { label: 'Profil', icon: 'person' },
};

const MANAGER_TABS: Record<string, TabMeta> = {
  home: { label: 'Ringkasan', icon: 'insights' },
  outlets: { label: 'Riwayat', icon: 'history' },
  findings: { label: 'Audit & SOP', icon: 'menu-book' },
  profile: { label: 'Profil', icon: 'person' },
};

export function CustomTabBar({ state, navigation }: any) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const isManager = user?.role?.toUpperCase().includes('HRBP') || user?.role?.toUpperCase().includes('MANAGER') || user?.email?.includes('manager');
  const isTrainer = !isManager && (user?.role?.toUpperCase().includes('TRAINER') || user?.email?.includes('trainer'));
  const tabs = isManager ? MANAGER_TABS : isTrainer ? TRAINER_TABS : AUDITOR_TABS;

  // The FAB directly triggers the permitted action based on role
  const goToPrimaryAction = useCallback(() => {
    if (isTrainer) {
      // Trainer directly starts In-House Training
      navigation.navigate('home', { openAction: 'training' });
      return;
    }
    if (!isManager) {
      // Auditor directly starts Audit Lapangan
      navigation.navigate('home', { openAction: 'audit' });
      return;
    }
    // Manager has supervisory access to choose either
    Alert.alert(
      'Mulai Aktivitas Supervisi',
      'Pilih aktivitas on-demand yang ingin Anda jalankan sekarang:',
      [
        {
          text: 'Mulai In-House Training',
          onPress: () => {
            navigation.navigate('home', { openAction: 'training' });
          },
        },
        {
          text: 'Mulai Audit Lapangan',
          onPress: () => {
            navigation.navigate('home', { openAction: 'audit' });
          },
        },
        {
          text: 'Batal',
          style: 'cancel',
        },
      ]
    );
  }, [isTrainer, isManager, navigation]);

  const renderTabItem = (route: { key: string; name: string }, index: number) => {
    const meta = tabs[route.name] ?? { label: route.name, icon: 'circle' as const };
    const isFocused = state.index === index;
    const color = isFocused ? COLORS.primary : COLORS.textMuted;

    const onPress = () => {
      const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name as never);
    };

    return (
      <TouchableOpacity
        key={route.key}
        accessibilityRole="button"
        accessibilityLabel={meta.label}
        accessibilityState={isFocused ? { selected: true } : {}}
        onPress={onPress}
        style={styles.tabItem}
        activeOpacity={0.7}
      >
        <View style={[styles.iconPill, isFocused && { backgroundColor: COLORS.primaryLight }]}>
          <MaterialIcons name={meta.icon} size={22} color={color} />
        </View>
        <Text style={[styles.tabLabel, { color, fontWeight: isFocused ? '700' : '500' }]} numberOfLines={1}>
          {meta.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.tabBar}>
        <View style={styles.tabSection}>
          {state.routes.slice(0, 2).map((route: { key: string; name: string }, index: number) => renderTabItem(route, index))}
        </View>

        <View style={styles.centerButtonWrapper}>
          <TouchableOpacity
            style={styles.floatingButton}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={isTrainer ? 'Mulai penilaian in-house' : 'Mulai inspeksi outlet'}
            onPress={goToPrimaryAction}
          >
            <MaterialIcons name="add" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabSection}>
          {state.routes.slice(2, 4).map((route: { key: string; name: string }, index: number) => renderTabItem(route, index + 2))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
  },
  tabBar: {
    flexDirection: 'row',
    height: 68,
    backgroundColor: COLORS.surface,
    borderRadius: 34,
    elevation: 12,
    shadowColor: '#0B1C30',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    minWidth: TOUCH_MIN,
    minHeight: TOUCH_MIN,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPill: {
    width: 46,
    height: 26,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10.5,
    marginTop: 2,
  },
  centerButtonWrapper: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.brandDeep,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -38,
    elevation: 10,
    shadowColor: COLORS.brandDeep,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 4,
    borderColor: COLORS.background,
  },
});
