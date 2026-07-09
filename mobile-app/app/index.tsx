import React, { useState } from 'react';
import { View, SafeAreaView, KeyboardAvoidingView, Platform, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Components
import { LoginHeader } from '../src/components/auth/LoginHeader';
import { InputField } from '../src/components/ui/InputField';
import { Button } from '../src/components/ui/Button';
import { TabSwitcher } from '../src/components/ui/TabSwitcher';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)/home');
    }, 1000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={{ flex: 1, backgroundColor: '#FFFFFF' }}
          contentContainerStyle={{ 
            paddingHorizontal: 24, 
            paddingTop: 40,
            paddingBottom: 40,
            justifyContent: 'center', 
            flexGrow: 1 
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <LoginHeader />

          {/* Form */}
          <View>
            <InputField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="auditor@perusahaan.com"
              keyboardType="email-address"
            />
            <InputField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              onToggleSecure={() => setShowPassword(!showPassword)}
            />

            {/* Remember Me & Forgot Password */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View className={`w-5 h-5 rounded border mr-2 items-center justify-center ${rememberMe ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                  {rememberMe && <Text className="text-white text-xs">✓</Text>}
                </View>
                <Text className="text-gray-500 text-sm">Ingat saya</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={{ color: '#419CC3', fontSize: 14, fontWeight: '500' }}>Lupa password?</Text>
              </TouchableOpacity>
            </View>

            <Button label="Masuk" onPress={handleLogin} isLoading={isLoading} />
          </View>

          {/* Footer */}
          <View style={{ alignItems: 'center', marginTop: 24, marginBottom: 32 }}>
            <Text className="text-gray-400 text-xs text-center">
              Belum memiliki akun? Hubungi Administrator untuk pembuatan akun auditor.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
