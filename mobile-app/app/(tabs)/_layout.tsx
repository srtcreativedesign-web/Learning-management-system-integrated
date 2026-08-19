import { Tabs } from 'expo-router';
import { CustomTabBar } from '../../src/components/navigation/CustomTabBar';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs 
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ 
        headerShown: false, 
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'Dashboard',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <MaterialIcons name="dashboard" size={size || 22} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="outlets" 
        options={{ 
          title: 'Outlet',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <MaterialIcons name="storefront" size={size || 22} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="findings" 
        options={{ 
          title: 'Temuan',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <MaterialIcons name="assignment-late" size={size || 22} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profil',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size || 22} color={color} />,
        }} 
      />
    </Tabs>
  );
}
