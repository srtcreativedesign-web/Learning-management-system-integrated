import React, { useState } from 'react';
import { View, SafeAreaView, KeyboardAvoidingView, Platform, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';

// Context & Components
import { useAuth } from '../src/context/AuthContext';
import { LoginHeader } from '../src/components/auth/LoginHeader';
import { InputField } from '../src/components/ui/InputField';
import { Button } from '../src/components/ui/Button';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim()) {
      setErrorMessage('Silakan masukkan alamat email Anda.');
      return;
    }

    setErrorMessage(null);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)/home');
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal masuk. Pastikan backend server aktif.');
    }
  };

  const handleQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setErrorMessage(null);
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
            paddingTop: 32,
            paddingBottom: 40,
            justifyContent: 'center', 
            flexGrow: 1 
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <LoginHeader />

          {/* Error Banner */}
          {errorMessage && (
            <View className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex-row items-center space-x-2.5">
              <MaterialIcons name="error-outline" size={20} color="#E11D48" />
              <Text className="text-rose-700 text-xs font-semibold flex-1 leading-snug">
                {errorMessage}
              </Text>
            </View>
          )}

          {/* Form */}
          <View>
            <InputField
              label="Alamat Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="budi.trainer@sobathr.com"
              keyboardType="email-address"
              iconName="mail-outline"
            />
            <InputField
              label="Kata Sandi"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              onToggleSecure={() => setShowPassword(!showPassword)}
              iconName="lock-outline"
            />

            {/* Remember Me & Forgot Password */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
              >
                <View className={`w-5 h-5 rounded-md border mr-2 items-center justify-center ${rememberMe ? 'bg-primary border-primary' : 'border-slate-300 bg-white'}`}>
                  {rememberMe && (
                    <MaterialIcons name="check" size={14} color="#FFFFFF" />
                  )}
                </View>
                <Text className="text-slate-600 text-sm font-medium">Ingat saya</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7}>
                <Text style={{ color: '#419CC3', fontSize: 14, fontWeight: '600' }}>
                  Lupa password?
                </Text>
              </TouchableOpacity>
            </View>

            <Button 
              label="Masuk ke Akun" 
              onPress={handleLogin} 
              isLoading={isLoading} 
              iconName="arrow-forward"
            />
          </View>

          {/* Demo Quick Fill Cards */}
          <View className="mt-5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <View className="flex-row items-center justify-between mb-2.5">
              <Text className="text-slate-600 text-xs font-bold uppercase tracking-wider flex-row items-center">
                <MaterialIcons name="touch-app" size={14} color="#419CC3" /> Akun Uji Coba Cepat
              </Text>
              <Text className="text-[10px] text-slate-400 font-medium">Klik untuk isi otomatis</Text>
            </View>

            <View className="flex-row flex-wrap gap-2">
              {/* Trainer */}
              <TouchableOpacity
                onPress={() => handleQuickDemo('budi.trainer@sobathr.com')}
                className="flex-1 min-w-[45%] p-2.5 bg-white border border-blue-200 rounded-xl active:bg-blue-50 shadow-2xs"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center space-x-1 mb-1">
                  <MaterialIcons name="school" size={14} color="#2563EB" />
                  <Text className="text-xs font-bold text-blue-700">Trainer TnD</Text>
                </View>
                <Text className="text-[10px] text-slate-500 font-medium truncate">
                  budi.trainer@sobathr.com
                </Text>
              </TouchableOpacity>

              {/* Auditor */}
              <TouchableOpacity
                onPress={() => handleQuickDemo('dian.auditor@sobathr.com')}
                className="flex-1 min-w-[45%] p-2.5 bg-white border border-emerald-200 rounded-xl active:bg-emerald-50 shadow-2xs"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center space-x-1 mb-1">
                  <MaterialIcons name="assignment-turned-in" size={14} color="#059669" />
                  <Text className="text-xs font-bold text-emerald-700">Auditor</Text>
                </View>
                <Text className="text-[10px] text-slate-500 font-medium truncate">
                  dian.auditor@sobathr.com
                </Text>
              </TouchableOpacity>

              {/* Super Admin */}
              <TouchableOpacity
                onPress={() => handleQuickDemo('admin@sobathr.com')}
                className="flex-1 min-w-[45%] p-2.5 bg-white border border-purple-200 rounded-xl active:bg-purple-50 shadow-2xs"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center space-x-1 mb-1">
                  <MaterialIcons name="admin-panel-settings" size={14} color="#7E22CE" />
                  <Text className="text-xs font-bold text-purple-700">Super Admin</Text>
                </View>
                <Text className="text-[10px] text-slate-500 font-medium truncate">
                  admin@sobathr.com
                </Text>
              </TouchableOpacity>

              {/* HRBP Manager */}
              <TouchableOpacity
                onPress={() => handleQuickDemo('manager.hrbp@sobathr.com')}
                className="flex-1 min-w-[45%] p-2.5 bg-white border border-indigo-200 rounded-xl active:bg-indigo-50 shadow-2xs"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center space-x-1 mb-1">
                  <MaterialIcons name="business-center" size={14} color="#4338CA" />
                  <Text className="text-xs font-bold text-indigo-700">Manager HRBP</Text>
                </View>
                <Text className="text-[10px] text-slate-500 font-medium truncate">
                  manager.hrbp@sobathr.com
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Info Box with Flat Icon */}
          <View className="mt-6 pt-6 border-t border-slate-100 flex-row items-center justify-center space-x-2">
            <MaterialIcons name="shield" size={16} color="#94A3B8" />
            <Text className="text-slate-400 text-xs text-center">
              Terhubung aman dengan SobatHR TnD System
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
