import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../context/AuthContext';

const COLORS = {
  primary: '#419CC3',
  inactive: '#94A3B8',
  background: '#FFFFFF',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { user } = useAuth();
  const isTrainer = user?.role?.toUpperCase().includes('TRAINER') || user?.email?.includes('trainer');

  // Dynamic tab labels & icons based on role
  const getTabMeta = (routeName: string) => {
    if (isTrainer) {
      switch (routeName) {
        case 'home':
          return { label: 'Training', icon: 'school' as const };
        case 'outlets':
          return { label: 'In-House', icon: 'fact-check' as const };
        case 'findings':
          return { label: 'Modul SOP', icon: 'menu-book' as const };
        case 'profile':
          return { label: 'Profil', icon: 'person' as const };
        default:
          return { label: routeName, icon: 'circle' as const };
      }
    }

    // Default Auditor
    switch (routeName) {
      case 'home':
        return { label: 'Beranda', icon: 'home' as const };
      case 'outlets':
        return { label: 'Outlet', icon: 'storefront' as const };
      case 'findings':
        return { label: 'Temuan', icon: 'assignment-late' as const };
      case 'profile':
        return { label: 'Profil', icon: 'person' as const };
      default:
        return { label: routeName, icon: 'circle' as const };
    }
  };

  const handleCenterFabPress = () => {
    if (isTrainer) {
      Alert.alert(
        'Aksi Cepat Trainer',
        'Pilih aktivitas in-house training:\n\n1. Mulai Penilaian Outlet (SB/B/C/K)\n2. Evaluasi Kompetensi Staf Baru\n3. Buka Panduan SOP Modul',
        [{ text: 'Tutup', style: 'cancel' }]
      );
    } else {
      Alert.alert(
        'Aksi Cepat Auditor',
        'Pilih aktivitas audit lapangan:\n\n1. Mulai Inspeksi Outlet\n2. Catat Temuan Baru\n3. Verifikasi Tindakan Perbaikan',
        [{ text: 'Tutup', style: 'cancel' }]
      );
    }
  };

  const renderTabItem = (route: any, index: number) => {
    const meta = getTabMeta(route.name);
    const isFocused = state.index === index;
    const color = isFocused ? COLORS.primary : COLORS.inactive;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <TouchableOpacity
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        onPress={onPress}
        style={styles.tabItem}
        activeOpacity={0.7}
      >
        <MaterialIcons name={meta.icon} size={24} color={color} />
        <Text style={[styles.tabLabel, { color }]}>
          {meta.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {/* Left Tabs (Index 0, 1) */}
        <View style={styles.tabSection}>
          {state.routes.slice(0, 2).map((route: any, index: number) => renderTabItem(route, index))}
        </View>

        {/* Center Floating Button */}
        <View style={styles.centerButtonWrapper}>
          <TouchableOpacity 
            style={styles.floatingButton}
            activeOpacity={0.8}
            onPress={handleCenterFabPress}
          >
            <MaterialIcons name="add" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Right Tabs (Index 2, 3) */}
        <View style={styles.tabSection}>
          {state.routes.slice(2, 4).map((route: any, index: number) => renderTabItem(route, index + 2))}
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
    paddingBottom: Platform.OS === 'ios' ? 24 : 16, // Safe area for iOS
    paddingHorizontal: 16,
  },
  tabBar: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: COLORS.background,
    borderRadius: 32, // Pill shape for the navbar container
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
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
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -40, // Floats above the navbar
    elevation: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 4,
    borderColor: '#F8F9FF', // Matches app background color to create a cutout illusion
  },
});
