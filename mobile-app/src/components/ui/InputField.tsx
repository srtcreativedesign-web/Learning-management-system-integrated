import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, RADIUS, TYPE } from '../../theme';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  onToggleSecure?: () => void;
  keyboardType?: 'default' | 'email-address';
  iconName?: keyof typeof MaterialIcons.glyphMap;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  onToggleSecure,
  keyboardType = 'default',
  iconName,
  autoCapitalize = 'none',
}: InputFieldProps) {
  // Focus ring: the only affordance telling you which field the keyboard is typing into.
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={{ ...TYPE.micro, color: COLORS.textSecondary, marginBottom: 8 }}>{label.toUpperCase()}</Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          minHeight: 54,
          paddingHorizontal: 16,
          borderRadius: RADIUS.md,
          backgroundColor: focused ? COLORS.surface : COLORS.surfaceSunken,
          borderWidth: 1.5,
          borderColor: focused ? COLORS.primary : 'transparent',
        }}
      >
        {iconName && <MaterialIcons name={iconName} size={20} color={focused ? COLORS.primary : COLORS.textMuted} />}

        <TextInput
          style={{ flex: 1, fontSize: 15.5, color: COLORS.textMain, padding: 0 }}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
        />

        {onToggleSecure && (
          <TouchableOpacity
            onPress={onToggleSecure}
            accessibilityLabel={secureTextEntry ? 'Tampilkan kata sandi' : 'Sembunyikan kata sandi'}
            hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
          >
            <MaterialIcons name={secureTextEntry ? 'visibility-off' : 'visibility'} size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
