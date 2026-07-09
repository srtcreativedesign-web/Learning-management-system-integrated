import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const COLORS = {
  primary: '#419CC3',
  inactive: '#94A3B8',
  background: '#FFFFFF',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

// Map route names to Material Icons
const getIconName = (routeName: string) => {
  switch (routeName) {
    case 'home': return 'home';
    case 'outlets': return 'storefront';
    case 'findings': return 'assignment-late';
    case 'profile': return 'person';
    default: return 'circle';
  }
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  // Option 1: Floating Center
  // We insert the floating button in the middle of our 4 tabs

  const renderTabItem = (route: any, index: number) => {
    const { options } = descriptors[route.key];
    const label = options.title !== undefined ? options.title : route.name;
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
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarTestID}
        onPress={onPress}
        style={styles.tabItem}
        activeOpacity={0.7}
      >
        <MaterialIcons name={getIconName(route.name)} size={24} color={color} />
        <Text style={[styles.tabLabel, { color }]}>
          {label}
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
            onPress={() => Alert.alert('Aksi Cepat', 'Pilih tindakan: \n1. Mulai Audit\n2. Catat Temuan Baru')}
          >
            <MaterialIcons name="add" size={32} color="#FFFFFF" />
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
