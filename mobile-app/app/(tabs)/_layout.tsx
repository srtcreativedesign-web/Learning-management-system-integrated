import { Tabs } from 'expo-router';
import { CustomTabBar } from '../../src/components/navigation/CustomTabBar';

export default function TabLayout() {
  return (
    <Tabs 
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ 
        headerShown: true, 
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'Dashboard',
          headerShown: false,
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📊</Text>,
        }} 
      />
      <Tabs.Screen 
        name="outlets" 
        options={{ 
          title: 'Outlet',
          headerTitle: 'Daftar Outlet',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏪</Text>,
        }} 
      />
      <Tabs.Screen 
        name="findings" 
        options={{ 
          title: 'Temuan',
          headerTitle: 'Daftar Temuan',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⚠️</Text>,
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profil',
          headerTitle: 'Profil Auditor',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
        }} 
      />
    </Tabs>
  );
}
