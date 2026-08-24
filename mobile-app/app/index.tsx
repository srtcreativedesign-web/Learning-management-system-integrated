import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { useAuth } from '../src/context/AuthContext';
import { InputField } from '../src/components/ui/InputField';
import { Button } from '../src/components/ui/Button';
import { COLORS, RADIUS, SHADOW, TYPE } from '../src/theme';

const DEMO_ACCOUNTS: { email: string; role: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { email: 'budi.trainer@sobathr.com', role: 'Trainer', icon: 'school' },
  { email: 'dian.auditor@sobathr.com', role: 'Auditor', icon: 'assignment-turned-in' },
  { email: 'admin@sobathr.com', role: 'Admin', icon: 'admin-panel-settings' },
  { email: 'manager.hrbp@sobathr.com', role: 'HRBP', icon: 'business-center' },
];

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
    <View style={{ flex: 1, backgroundColor: COLORS.brandDeep }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandDeep} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* ================= BRAND BAND ================= */}
          <View style={{ paddingTop: insets.top + 32, paddingHorizontal: 28, paddingBottom: 40, overflow: 'hidden' }}>
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: -60,
                right: -70,
                width: 220,
                height: 220,
                borderRadius: 110,
                backgroundColor: 'rgba(255,255,255,0.07)',
              }}
            />

            <View
              style={{
                width: 54,
                height: 54,
                borderRadius: RADIUS.md,
                backgroundColor: COLORS.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialIcons name="school" size={28} color="#FFFFFF" />
            </View>

            <Text style={{ ...TYPE.micro, color: COLORS.onBrandMuted, marginTop: 20 }}>TND LMS & AUDIT</Text>
            <Text style={{ fontSize: 32, fontWeight: '800', color: COLORS.onBrand, letterSpacing: -1, marginTop: 6 }}>
              Selamat Datang
            </Text>
            <Text style={{ ...TYPE.body, color: COLORS.onBrandMuted, marginTop: 8, lineHeight: 21 }}>
              Masuk untuk mengakses training outlet, modul SOP, dan inspeksi audit lapangan.
            </Text>
          </View>

          {/* ================= FORM SHEET ================= */}
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.surface,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              paddingHorizontal: 24,
              paddingTop: 28,
              paddingBottom: insets.bottom + 28,
            }}
          >
            {errorMessage && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  backgroundColor: COLORS.dangerLight,
                  borderRadius: RADIUS.md,
                  padding: 14,
                  marginBottom: 20,
                }}
              >
                <MaterialIcons name="error-outline" size={20} color={COLORS.danger} />
                <Text style={{ ...TYPE.label, color: COLORS.danger, flex: 1, lineHeight: 18 }}>{errorMessage}</Text>
              </View>
            )}

            <InputField
              label="Alamat Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="nama@sobathr.com"
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

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', minHeight: 44, paddingRight: 8 }}
                onPress={() => setRememberMe(!rememberMe)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: rememberMe }}
                activeOpacity={0.7}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 7,
                    marginRight: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: rememberMe ? COLORS.primary : COLORS.surface,
                    borderWidth: rememberMe ? 0 : 1.5,
                    borderColor: COLORS.border,
                  }}
                >
                  {rememberMe && <MaterialIcons name="check" size={15} color="#FFFFFF" />}
                </View>
                <Text style={{ ...TYPE.body, color: COLORS.textSecondary }}>Ingat saya</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} style={{ minHeight: 44, justifyContent: 'center' }}>
                <Text style={{ ...TYPE.body, fontWeight: '600', color: COLORS.primary }}>Lupa password?</Text>
              </TouchableOpacity>
            </View>

            <Button label="Masuk ke Akun" onPress={handleLogin} isLoading={isLoading} iconName="arrow-forward" />

            {/* Demo accounts — compact chips instead of four bordered cards. */}
            <View style={{ marginTop: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: COLORS.divider }} />
                <Text style={{ ...TYPE.micro, color: COLORS.textMuted }}>AKUN UJI COBA</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: COLORS.divider }} />
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {DEMO_ACCOUNTS.map((acct) => {
                  const active = email === acct.email;
                  return (
                    <TouchableOpacity
                      key={acct.email}
                      onPress={() => handleQuickDemo(acct.email)}
                      activeOpacity={0.8}
                      accessibilityLabel={`Isi otomatis akun ${acct.role}`}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 7,
                        minHeight: 44,
                        paddingHorizontal: 14,
                        borderRadius: RADIUS.pill,
                        backgroundColor: active ? COLORS.brandDeep : COLORS.surfaceSunken,
                      }}
                    >
                      <MaterialIcons
                        name={acct.icon}
                        size={16}
                        color={active ? COLORS.onBrand : COLORS.brandDark}
                      />
                      <Text style={{ ...TYPE.label, color: active ? COLORS.onBrand : COLORS.textSecondary }}>
                        {acct.role}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 24 }}>
              <MaterialIcons name="lock" size={14} color={COLORS.textMuted} />
              <Text style={{ fontSize: 12, color: COLORS.textMuted }}>Terhubung aman dengan SobatHR TnD</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
